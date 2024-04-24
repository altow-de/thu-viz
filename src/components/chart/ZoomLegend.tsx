import React from "react";
import LegendWrapper from "./LegendWrapper";

const ZoomLegend = () => {
  return (
    <div className="ml-1 mb-2 sm:ml-2">
      <LegendWrapper>
        <div className="hidden  md:inline-block">
          <span className="font-semibold text-danube-600 mr-1">X-Axis Zoom:</span>
          hover over the chart until
          <img className="hidden md:inline-block h-3 w-3 mx-1 align-middle" src="ew-arrow.svg" alt="Arrow icon" />
          cursor appears, hold left-click to brush
        </div>
        <div className="hidden md:inline-block">
          <span className="font-semibold text-danube-600 mr-1">Y-Axis Zoom:</span>
          hover over the y-axis until
          <img
            className="hidden md:inline-block h-3 w-3 mx-1 align-middle"
            src="ns-arrow.svg"
            alt="North-South arrow"
          />
          cursor appears, hold left-click to brush
        </div>
        <div className="hidden md:inline-block">
          <span className="font-semibold text-danube-600 mr-1 inline-block">Reset Chart:</span>
          <span className="inline-block">double left-click to set the chart to its initial state</span>
        </div>
        <div className="visible md:hidden">
          <span className="font-semibold text-danube-600 mr-1">Zoom:</span>
          <span>drag with 1 finger to zoom in and out</span>
        </div>
        <div className="visible md:hidden">
          <span className="font-semibold text-danube-600 mr-1 inline-block">Reset Chart:</span>
          <span>double finger-tap on the chart to set it to its initial state</span>
        </div>
      </LegendWrapper>
    </div>
  );
};

export default ZoomLegend;
