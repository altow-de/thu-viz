import { useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  GeoJSONFeature,
  Map,
  MapGeoJSONFeature,
  MapMouseEvent,
  NavigationControl,
  Popup,
  LngLat,
  GeoJSONSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { HoverInfoKeys, LayerZoom, MapStyles } from "@/frontend/constants";
import { MapType } from "@/frontend/enum";
import { TrackData } from "@/backend/services/ProcessedValueService";
import { OverviewDeploymentTrackData, Region, SwitchTableData } from "@/frontend/types";
import MapStyle from "./MapStyle";
import { getDepthFromPressure } from "@/frontend/utils";

export interface OceanMapProps {
  type: MapType;
  data?: TrackData[] | OverviewDeploymentTrackData[];
  region?: Region;
  forwardedRef?: any;
}
type TrackObj = {
  coordinates: number[][];
  info: {
    deepest?: number;
    deployment_id?: number;
    logger_id?: number;
    name?: string;
    measuring_time?: Date;
  };
};

/**
 * OceanMap component.
 *
 * @param {MapType} type - Specifies the type of the map to be displayed (route or point).
 * @param {TrackData[] | OverviewDeploymentTrackData[]} [data] - The data to be displayed on the map.
 * @param {Region} [region] - The region to be highlighted on the map.
 * @param {any} [forwardedRef] - A forwarded ref to access the map functions.
 */
const OceanMap = ({ type, data, region, forwardedRef }: OceanMapProps) => {
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);
  const [mapStyle, setMapStyle] = useState(Object.keys(MapStyles)[0]);
  const navControl = new NavigationControl();

  const initialState = {
    lat: 54.1767,
    lng: 12.08402,
    zoom: 10,
  };

  /**
   * Extracts coordinates from the data object.
   * @param {TrackData | OverviewDeploymentTrackData} obj - The data object.
   * @returns {object} - The extracted coordinates.
   */
  const extractCoordinates = (obj: TrackData | OverviewDeploymentTrackData) => {
    const firstDataItem = obj;
    let lng = initialState.lng; // Default longitude
    let lat = initialState.lat; // Default latitude

    if (firstDataItem) {
      lng =
        (firstDataItem as TrackData)?.position?.x ||
        (firstDataItem as OverviewDeploymentTrackData)?.position_start?.x ||
        lng;
      lat =
        (firstDataItem as TrackData)?.position?.y ||
        (firstDataItem as OverviewDeploymentTrackData)?.position_start?.y ||
        lat;
    }

    return { lng, lat };
  };

  /**
   * Creates an object with track data.
   * @param {TrackData | OverviewDeploymentTrackData} obj - The data object.
   * @returns {object} - The track data object.
   */
  const getTrackDataObj = (obj: TrackData | OverviewDeploymentTrackData) => {
    const trackDataObj = obj as TrackData;
    const deploymentTrackDataObj = obj as SwitchTableData;

    if (deploymentTrackDataObj.showInMap === undefined) {
      const depthObj = getDepthFromPressure(Number(trackDataObj.pressure));

      const obj = {
        deepest: depthObj.val + depthObj.unit,
        measuring_time: new Date(trackDataObj.measuring_time)?.toLocaleString("de"),
      };
      return obj;
    }

    return {
      logger_id: deploymentTrackDataObj.logger_id,
      deployment_id: deploymentTrackDataObj.deployment_id,
      name: deploymentTrackDataObj.name,
      measuring_time: new Date(deploymentTrackDataObj.time_start)?.toLocaleString("de"),
    };
  };

  /**
   * Generates track data for the map.
   */
  const trackData =
    data && data.length > 0
      ? data?.map((trackObj: TrackData | OverviewDeploymentTrackData) => {
          const { lng, lat } = extractCoordinates(trackObj);
          const info = getTrackDataObj(trackObj);
          return { coordinates: [lng, lat], info: info } as unknown as TrackObj;
        })
      : [];

  /**
   * Changes the map style.
   * @param {string} mapStyle - The new map style.
   */
  const onMapStyleChange = (mapStyle: string) => {
    setMapStyle(mapStyle);
  };

  /**
   * Handles popups on the map.
   */
  const handlePopUps = () => {
    if (!map.current) return;
    const popup = new Popup({
      closeButton: false,
      closeOnClick: false,
    });
    map.current.on(
      "mouseenter",
      "route-point",
      (
        e: MapMouseEvent & {
          features?: MapGeoJSONFeature[];
        }
      ) => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "pointer";
        const feature: GeoJSONFeature = e?.features?.[0] as GeoJSONFeature;
        const geometry: GeoJSON.Geometry = feature.geometry as GeoJSON.Point;

        const coordinates = geometry.coordinates?.slice();
        const jsonObj = JSON.parse(feature.properties.info);

        const htmlString = Object.keys(jsonObj).map((jsonKey) => {
          return `<div>${HoverInfoKeys[jsonKey]} ${jsonObj[jsonKey]}</div>`;
        });

        const html = `<div>${htmlString.join("")}</div>`;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup
          .setLngLat(coordinates as unknown as LngLat)
          .setHTML(html)
          .addTo(map.current);
      }
    );

    map.current.on("mouseleave", "route-point", () => {
      popup.remove();
      if (!map.current) return;
      map.current.getCanvas().style.cursor = "";
    });
  };

  /**
   * Handles image loading for the map.
   */
  const handleImages = () => {
    map.current?.loadImage("circle.png", (error, image) => {
      if (error || !image) throw error;
      if (!map.current?.hasImage("circle_point")) {
        map.current?.addImage("circle_point", image);
      }

      if (type === MapType.route && trackData) {
        handleLayer();
        addRouteLayer();
      }
    });

    map.current?.loadImage("location-small.png", (error, image) => {
      if (error || !image) throw error;
      if (!map.current?.hasImage("location-small")) {
        map.current?.addImage("location-small", image);
      }
      if (type === MapType.point && trackData) {
        handleLayer();
        addPointLayer("location-small");
      }
    });
  };

  /**
   * Adds the map source.
   */
  const handleSource = async () => {
    if (!map.current?.getSource("openseamap-source")) {
      map.current?.addSource("openseamap-source", {
        type: "raster",
        tiles: ["https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"],
        tileSize: 256,
      });
    }
    if (type === MapType.route) {
      addRouteSource(trackData);
    }
    if (type === MapType.point) {
      addPointSource(trackData);
    }
  };

  const addPointSource = (trackData: TrackObj[]) => {
    const features = trackData.map((track) => {
      return {
        geometry: {
          type: "Point",
          coordinates: track.coordinates,
        },
        type: "Feature",
        properties: { info: track.info },
      } as any;
    });

    if (!map?.current?.getSource("route-point-source")) {
      map.current?.addSource("route-point-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features,
        },
      });
    } else {
      (map?.current?.getSource("route-point-source") as GeoJSONSource)?.setData({
        type: "FeatureCollection",
        features: features,
      });
    }
  };

  const addRouteSource = (trackData: TrackObj[]) => {
    const data = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: trackData.map((track) => track.coordinates),
      },
    };

    if (!map?.current?.getSource("route-source")) {
      map.current?.addSource("route-source", {
        type: "geojson",
        data: data,
      });
    } else {
      (map?.current?.getSource("route-source") as GeoJSONSource)?.setData(data as any);
    }
    addPointSource(trackData);
  };

  const addRouteLayer = () => {
    if (map.current?.getLayer("route")) map.current?.removeLayer("route");

    if (!map.current?.getLayer("route")) {
      map.current?.addLayer({
        ...LayerZoom,
        id: "route",
        type: "line",
        source: "route-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#963748",
          "line-width": 4,
        },
      });
    }
    addPointLayer("circle_point");
  };

  const addPointLayer = (image: string) => {
    if (map.current?.getLayer("route-point")) map.current?.removeLayer("route-point");
    if (!map.current?.getLayer("route-point")) {
      map.current?.addLayer({
        id: "route-point",
        type: "symbol",
        source: "route-point-source",
        layout: {
          "icon-image": image,
        },
      });
    }
  };

  /**
   * Handles the region layer on the map.
   */
  const handleRegionLayer = () => {
    if (!region) {
      if (map.current?.getLayer("region")) {
        map.current?.removeLayer("region");
      }
      return;
    }
    const features = region.coordinates.map((polygon) => {
      return {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: polygon,
        },
      };
    });
    const data = {
      type: "FeatureCollection",
      features: features,
    };
    if (!map.current?.getSource("region-source")) {
      map.current?.addSource("region-source", {
        type: "geojson",
        data: data,
      });
    } else {
      (map?.current?.getSource("region-source") as GeoJSONSource)?.setData(data as any);
    }

    if (!map.current?.getLayer("region") && map.current?.getSource("region-source")) {
      map.current?.addLayer({
        id: "region",
        type: "fill",
        ...LayerZoom,
        source: "region-source",
        paint: {
          "fill-color": "#399d73",
          "fill-opacity": 0.2,
        },
      });
    }
  };

  /**
   * Handles adding the map layer.
   */
  const handleLayer = () => {
    handleSource();
    if (!map.current?.getLayer("openseamap")) {
      map.current?.addLayer({
        id: "openseamap",
        type: "raster",
        source: "openseamap-source",
        ...LayerZoom,
        paint: {
          "raster-opacity": 0.8,
        },
      });
    }
  };

  useImperativeHandle(forwardedRef, () => ({
    exportMapAsPNG,
  }));

  /**
   * Exports the map as PNG.
   * @param {function} callback - The callback function to handle the PNG blob.
   */
  const exportMapAsPNG = (callback: (blob: any) => void) => {
    if (!map.current) return;

    if (map.current.isStyleLoaded()) {
      const canvas = map.current.getCanvas();
      map.current.redraw();

      canvas.toBlob((blob) => {
        if (callback && typeof callback === "function") {
          callback(blob);
        }
      }, "ocean-map/png");
    }
  };

  useEffect(() => {
    const mapUrl =
      "https://api.maptiler.com/maps/" + mapStyle + "/style.json?key=" + process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN;
    map?.current?.setStyle(`${mapUrl}`, { diff: false });
    map.current?.on("style.load", async function () {
      const center = map.current?.getCenter();
      const zoom = map.current?.getZoom();
      if (center && zoom) {
        map.current?.setCenter(center);
        map.current?.setZoom(zoom);
      }
      handleRegionLayer();
      handleImages();
      handlePopUps();
    });
  }, [mapStyle]);

  useEffect(() => {
    if (!mapContainer?.current) return;

    if (
      map?.current &&
      map?.current?.loaded() &&
      map?.current?.isStyleLoaded() &&
      map?.current?._fullyLoaded &&
      map?.current?._loaded
    ) {
      if (data?.[0]) {
        const { lng, lat } = extractCoordinates(data[0]);
        map.current.setCenter([lng, lat]);
      }
      map.current.setZoom(10);
      handleRegionLayer();
      handleImages();
      handlePopUps();
    } else {
      const { lng, lat } = extractCoordinates(data?.[0] as TrackData | OverviewDeploymentTrackData) || [
        initialState.lng,
        initialState.lat,
      ];
      if (!map.current) {
        map.current = new Map({
          container: mapContainer.current,
          style: `${
            "https://api.maptiler.com/maps/" +
            mapStyle +
            "/style.json?key=" +
            process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN
          }`,
          center: [lng, lat],
          zoom: 10,
        });
      }
    }
    map?.current?.on("load", async function () {
      handleRegionLayer();
      if (data?.length && data?.length > 0) handleImages();
      handlePopUps();
      if (data?.[0]) {
        const { lng, lat } = extractCoordinates(data[0]);
        map?.current?.setCenter([lng, lat]);
      }
    });
  }, [data, region]);

  useEffect(() => {
    map?.current?.on("load", async function () {
      handleRegionLayer();
      handleImages();
      handlePopUps();
      map?.current?.addControl(navControl, "bottom-right");
      if (data?.[0]) {
        const { lng, lat } = extractCoordinates(data[0]);
        map?.current?.setCenter([lng, lat]);
      }
    });
  }, []);

  return (
    <div className="relative">
      <MapStyle selectedStyle={mapStyle} setSelectedStyle={onMapStyleChange} />
      <div className="h-[320px] sm:h-[580px]" ref={mapContainer} />
    </div>
  );
};

export default OceanMap;
