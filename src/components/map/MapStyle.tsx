import { MapStyles } from "@/frontend/constants";
import React, { useState } from "react";
import RadioButton from "../basic/RadioButton";

export interface MapStyleProps {
  selectedStyle: string;
  setSelectedStyle: (selectedStyle: string) => void;
}

const MapStyle = ({ selectedStyle, setSelectedStyle }: MapStyleProps) => {
  return (
    <div className="absolute bg-white w-auto h-auto right-0 top-4 z-10 rounded-l-lg p-2 text-sm flex shadow-md flex-col">
      {Object.keys(MapStyles).map((key) => {
        return (
          <RadioButton selectedStyle={selectedStyle} key={key} setSelectedStyle={setSelectedStyle} mapStyleKey={key} />
        );
      })}
    </div>
  );
};

export default MapStyle;
