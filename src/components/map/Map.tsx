import { useEffect, useRef, useState } from "react";
import { Map, NavigationControl, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapStyle from "./MapStyle";
import { LayerZoom, MapStyles } from "@/frontend/constants";

interface OceanMapProps {
  type: string;
}

const OceanMap = ({ type = "route" }: OceanMapProps) => {
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);
  const [mapStyle, setMapStyle] = useState(Object.keys(MapStyles)[0]);

  const initialState = {
    lat: 54.1767,
    lng: 12.08402,
    zoom: 11,
  };

  const onMapStyleChange = (mapStyle: string) => {
    console.log(mapStyle);

    const mapUrl =
      "https://api.maptiler.com/maps/" + mapStyle + "/style.json?key=" + process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN;

    map.current?.setStyle(`${mapUrl}`);
    map.current?.on("styledata", function () {
      handleSource();
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
    map.current.on("mouseenter", "route-point", (e) => {
      // Change the cursor style as a UI indicator.
      if (!map.current) return;
      map.current.getCanvas().style.cursor = "pointer";
      const coordinates = e?.features?.[0].geometry?.coordinates?.slice();
      const html = `  <div>Hover info</div>  `;
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(html).addTo(map.current);
    });

    map.current.on("mouseleave", "route-point", () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = "";
      popup.remove();
    });
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
    if (type === "route") {
      addRouteSource([
        [12.08402, 54.1767],
        [12.05402, 54.1867],
        [11.00402, 54.2],
        [11.50017, 54.77662],
      ]);
    }
  };

  const addRouteSource = (coordinates: number[][]) => {
    if (!map?.current?.getSource("route-source")) {
      map.current?.addSource("route-source", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      });
    }
    if (!map?.current?.getSource("route-point-source")) {
      const features = coordinates.map((coord) => {
        return {
          geometry: {
            type: "Point",
            coordinates: coord,
          },
          type: "Feature",
        };
      });
      map.current?.addSource("route-point-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features,
        },
      });
    }
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
    //Point Layer
    if (!map.current?.getLayer("route-point") && map.current?.getSource("route-point-source")) {
      map.current?.addLayer({
        id: "route-point",
        type: "symbol",
        source: "route-point-source",
        layout: {
          "icon-image": "circle",
        },
      });
    }
  };

  /**
   * Function to handle adding the map layer.
   * @function
   */
  const handleLayer = () => {
    if (!map.current?.getLayer("openseamap"))
      map.current?.addLayer({
        id: "openseamap",
        type: "raster",
        source: "openseamap-source",
        ...LayerZoom,
        paint: {
          "raster-opacity": 0.8,
        },
      });
    if (type === "route") {
      addRouteLayer();
    }
    if (type === "marker") {
    }
  };

  // Effect to initialize the map
  useEffect(() => {
    if (!mapContainer?.current || map.current) return;
    map.current = new Map({
      container: mapContainer.current,
      style: `${
        "https://api.maptiler.com/maps/" + mapStyle + "/style.json?key=" + process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN
      }`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });
    map.current?.loadImage("circle.png", (error, image) => {
      if (error || !image) throw error;
      map.current?.addImage("circle", image);
    });
    map.current.on("load", async function () {
      handleSource();
      handleLayer();
      handlePopUps();
    });
    map.current.addControl(new NavigationControl(), "bottom-right");
  }, [mapStyle]);

  return (
    <div className="relative">
      <MapStyle selectedStyle={mapStyle} setSelectedStyle={onMapStyleChange} />
      <div className="h-[320px] sm:h-[580px]" ref={mapContainer} />
    </div>
  );
};
export default OceanMap;
