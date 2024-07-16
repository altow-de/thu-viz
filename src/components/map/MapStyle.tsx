import { MapStyles } from "@/frontend/constants";
import { useClickAway } from "@uidotdev/usehooks";
import React, { LegacyRef, useEffect, useState } from "react";
import RadioButton from "../basic/RadioButton";
import InfoIcon from "../icons/InfoIcon";

export interface MapStyleProps {
  selectedStyle: string;
  setSelectedStyle: (selectedStyle: string) => void;
}

/**
 * MapStyle component.
 *
 * @param {string} selectedStyle - The currently selected map style.
 * @param {function} setSelectedStyle - Function to update the selected map style.
 */
const MapStyle = ({ selectedStyle, setSelectedStyle }: MapStyleProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  const ref = useClickAway(() => {
    setVisible(windowWidth > 640);
  }) as LegacyRef<HTMLDivElement>;

  /**
   * Handles window resize events.
   */
  const handleResize = () => {
    const width = window?.innerWidth;
    setWindowWidth(width);
    setVisible(width >= 640);
  };

  useEffect(() => {
    // Initial resize handling after rendering
    handleResize();
    // Add event listener for resize event
    window?.addEventListener("resize", handleResize);
    // Cleanup event listener
    return () => {
      window?.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`absolute bg-white w-auto h-auto right-0 top-4 z-10 rounded-l-lg p-2 text-sm flex shadow-md flex-col hover:shadow-lg ${
        !visible ? "rounded-lg right-2.5" : ""
      }`}
    >
      {!visible && (
        <div
          className="sm:hidden w-4 h-4 cursor-pointer"
          onClick={() => {
            if (windowWidth < 640) setVisible(true);
          }}
        >
          <InfoIcon />
        </div>
      )}
      <div ref={ref} className="flex flex-1 gap-2">
        {visible &&
          Object.keys(MapStyles).map((key) => {
            return (
              <RadioButton
                selectedStyle={selectedStyle}
                key={key}
                setSelectedStyle={setSelectedStyle}
                mapStyleKey={key}
              />
            );
          })}
      </div>
    </div>
  );
};

export default MapStyle;
