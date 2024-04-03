import React, { useState } from "react";

const ZoomLegend = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {!isOpen && (
        <img
          className="w-4 h-4 cursor-pointer"
          onClick={handleOnClick}
          src="info.svg"
          alt="Info icon"
        />
      )}
      {isOpen && (
        <div
          id="zoom-legend"
          onClick={handleOnClick}
          className="flex flex-col w-fit p-1 mb-5 border-2 rounded-md border-danube-500 text-xs text-danube-900 cursor-pointer"
        >
          <div className="hidden  md:inline-block">
            <span className="font-semibold text-danube-600 mr-1">
              X-Axis Zoom:
            </span>
            hover over the chart until
            <img
              className="hidden md:inline-block h-3 w-3 mx-1 align-middle"
              src="ew-arrow.svg"
              alt="Arrow icon"
            />
            cursor appears, hold left-click to brush
          </div>
          <div className="hidden md:inline-block">
            <span className="font-semibold text-danube-600 mr-1">
              Y-Axis Zoom:
            </span>
            hover over the y-axis until
            <img
              className="hidden md:inline-block h-3 w-3 mx-1 align-middle"
              src="ns-arrow.svg"
              alt="North-South arrow"
            />
            cursor appears, hold left-click to brush
          </div>
          <div className="hidden md:inline-block">
            <span className="font-semibold text-danube-600 mr-1 inline-block">
              Reset Chart:
            </span>
            <span className="inline-block">
              double left-click to set the chart to its initial state
            </span>
          </div>
          <div className="visible md:hidden">
            <span className="font-semibold text-danube-600 mr-1">Zoom:</span>
            <span>drag with 2 fingers to zoom in and out</span>
          </div>
          <div className="visible md:hidden">
            <span className="font-semibold text-danube-600 mr-1 inline-block">
              Reset Chart:
            </span>
            <span>
              double finger-tap on the chart to set it to its initial state
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomLegend;
