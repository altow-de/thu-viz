import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
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
import { OverviewDeploymentTrackData, Region } from "@/frontend/types";
import MapStyle from "./MapStyle";
import { getDepthFromPressure } from "@/frontend/utils";

interface OceanMapProps {
  type: MapType;
  data?: TrackData[] | OverviewDeploymentTrackData[];
  region?: Region;
}

type TrackObj = {
  coordinates: number[][];
  info: {
    depth?: number;
    deployment_id?: number;
    logger_id?: number;
    name?: string;
    measuring_time?: Date;
  };
};

const OceanMap = forwardRef(({ type, data, region }: OceanMapProps, ref) => {
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);
  const [mapStyle, setMapStyle] = useState(Object.keys(MapStyles)[0]);

  const initialState = {
    lat: 54.1767,
    lng: 12.08402,
    zoom: 10,
  };
  const extractCoordinates = (obj: TrackData | OverviewDeploymentTrackData) => {
    // Versuch, die Koordinaten aus dem ersten Datenelement zu extrahieren

    const firstDataItem = obj;
    let lng = initialState.lng; // Standardwert für Längengrad
    let lat = initialState.lat; // Standardwert für Breitengrad

    if (firstDataItem) {
      // Versuch, Längen- und Breitengrad aus den verschiedenen Datenstrukturen zu extrahieren
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
  const getTrackDataObj = (obj: TrackData | OverviewDeploymentTrackData) => {
    const trackDataObj = obj as TrackData;
    const deploymentTrackDataObj = obj as OverviewDeploymentTrackData;
    if (trackDataObj.pressure) {
      const depthObj = getDepthFromPressure(Number(trackDataObj.pressure)).val;
      return {
        depth: depthObj.toString(),
        measuring_time: new Date(trackDataObj.measuring_time)?.toLocaleString("de"),
      };
    }

    return {
      logger_id: deploymentTrackDataObj.logger_id,
      deployment_id: deploymentTrackDataObj.deployment_id,
      name: deploymentTrackDataObj.name,
      measuring_time: new Date(deploymentTrackDataObj.time_start)?.toLocaleString("de"),
    };
  };

  const trackData =
    data && data.length > 0
      ? data?.map((trackObj: TrackData | OverviewDeploymentTrackData) => {
          const { lng, lat } = extractCoordinates(trackObj);
          const info = getTrackDataObj(trackObj);
          return { coordinates: [lng, lat], info: info } as unknown as TrackObj;
        })
      : [];

  const onMapStyleChange = (mapStyle: string) => {
    const mapUrl =
      "https://api.maptiler.com/maps/" + mapStyle + "/style.json?key=" + process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN;

    map.current?.setStyle(`${mapUrl}`, { diff: false });

    map.current?.on("load", function () {
      handleImages();
      handleSource();
      handleRegionLayer();
      handleLayer();
      handlePopUps();
    });
    setMapStyle(mapStyle);
  };

  const handlePopUps = () => {
    // Create a popup, but don't add it to the map yet.
    const popup = new Popup({
      closeButton: false,
      closeOnClick: false,
    });

    if (!map.current) return;
    map.current.on(
      "mouseenter",
      "route-point",
      (
        e: MapMouseEvent & {
          features?: MapGeoJSONFeature[];
        }
      ) => {
        // Change the cursor style as a UI indicator.
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "pointer";
        const feature: GeoJSONFeature = e?.features?.[0] as GeoJSONFeature;
        const geometry: GeoJSON.Geometry = feature.geometry as GeoJSON.Point;

        const coordinates = geometry.coordinates?.slice();
        const jsonObj = JSON.parse(feature.properties.info);

        const htmlString = Object.keys(jsonObj).map((jsonKey) => {
          return `<div>${HoverInfoKeys[jsonKey]} ${jsonObj[jsonKey]}</div>`;
        });

        const html = `<div>Hover info</div><div>${htmlString.join("")}</div>`;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup
          .setLngLat(coordinates as unknown as LngLat)
          .setHTML(html)
          .addTo(map.current);
      }
    );

    map.current.on("mouseleave", "route-point", () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = "";
      popup.remove();
    });
  };

  const handleImages = () => {
    if (!map.current?.getImage("circle")) {
      map.current?.loadImage("circle.png", (error, image) => {
        if (error || !image) throw error;
        if (!map.current?.getImage("circle")) {
          map.current?.addImage("circle", image);
        }
      });
    }
    if (!map.current?.getImage("location")) {
      map.current?.loadImage("location-small.png", (error, image) => {
        if (error || !image) throw error;
        if (!map.current?.getImage("location")) {
          map.current?.addImage("location", image);
        }
      });
    }
  };

  /**
   * Function to handle adding the map source.
   * @function
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
    //Route Layer
    if (!map.current?.getLayer("route") && map.current?.getSource("route-source")) {
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
    addPointLayer("circle");
  };
  const addPointLayer = (image: string) => {
    //Point Layer
    if (!map.current?.getLayer("route-point") && map.current?.getSource("route-point-source")) {
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

  const handleRegionLayer = () => {
    if (!region) return;
    const features = region.coordinates.map((polygon) => {
      return {
        type: "Feature",
        properties: {}, // Zusätzliche Eigenschaften für das Feature
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
   * Function to handle adding the map layer.
   * @function
   */
  const handleLayer = () => {
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
    if (type === MapType.route && trackData) {
      addRouteLayer();
    }
    if (type === MapType.point && trackData) {
      addPointLayer("location");
    }
  };

  useImperativeHandle(ref, () => ({
    exportMapAsPNG,
  }));

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

  // Effect to initialize the map
  useEffect(() => {
    if (!mapContainer?.current) return;
    if (map?.current && map?.current?.loaded()) {
      if (data?.[0]) {
        const { lng, lat } = extractCoordinates(data[0]);
        map.current.setCenter([lng, lat]);
      }
      map.current.setZoom(10);

      handleImages();
      handleRegionLayer();
      handleSource();
      handleLayer();
      handlePopUps();
    } else {
      const { lng, lat } = extractCoordinates(data?.[0] as TrackData | OverviewDeploymentTrackData) || [
        initialState.lng,
        initialState.lat,
      ];
      const center = map.current?.getCenter();
      const zoom = map.current?.getZoom();
      if (center && zoom) {
        map.current = new Map({
          container: mapContainer.current,
          style: `${
            "https://api.maptiler.com/maps/" +
            mapStyle +
            "/style.json?key=" +
            process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN
          }`,
          center: center,
          zoom: zoom,
        });
      } else {
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
      map.current.on("load", async function () {
        handleImages();
        handleRegionLayer();
        handleSource();
        handleLayer();
        handlePopUps();
      });
      map.current.addControl(new NavigationControl(), "bottom-right");
    }
  }, [mapStyle, data, region]);

  return (
    <div className="relative">
      <MapStyle selectedStyle={mapStyle} setSelectedStyle={onMapStyleChange} />
      <div className="h-[320px] sm:h-[580px]" ref={mapContainer} />
    </div>
  );
});
export default OceanMap;
