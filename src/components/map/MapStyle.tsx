import { MapStyles } from "@/frontend/constants";
import React from "react";
import Checkbox from "../basic/Checkbox";

interface MapStyleProps {
  selectedStyle: string;
}

const MapStyle = () => {
  return (
    <div className="absolute bg-white w-40 h-auto right-0 top-4 z-10 rounded-l-lg p-2 text-sm">
      {Object.keys(MapStyles).map((key) => {
        return (
          <div className="w-full">
            <Checkbox />
            {MapStyles[key]}
          </div>
        );
      })}
    </div>
  );
};

export default MapStyle;
