import { useEffect, useRef, useState } from "react";
import { Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapStyle from "./MapStyle";

const OceanMap = () => {
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);
  const [mapStyle, setMapStyle] = useState("basic-v2");

  const initialState = {
    lat: 54.1767,
    lng: 12.08402,
    zoom: 11,
  };

  /**
   * Function to handle adding the map source.
   * @function
   */
  const handleSource = () => {
    if (!map.current?.getSource("openseamap-source")) {
      map.current?.addSource("openseamap-source", {
        type: "raster",
        tiles: ["https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"],
        tileSize: 256,
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
        minzoom: 0,
        maxzoom: 22,
        paint: {
          "raster-opacity": 0.8,
        },
      });
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
    map.current.on("load", function () {
      handleSource();
      handleLayer();
    });
    map.current.addControl(new NavigationControl(), "bottom-right");
  }, []);

  return (
    <div className="relative">
      <MapStyle />
      <div className="h-[580px]" ref={mapContainer} />
    </div>
  );
};
export default OceanMap;
