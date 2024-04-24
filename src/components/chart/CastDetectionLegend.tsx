import React from "react";
import LegendWrapper from "./LegendWrapper";
import { LegendKey } from "@/frontend/enum";

interface CastDetectionLegendProps {
  textKey: string;
}

const CastDetectionLegend = ({ textKey }: CastDetectionLegendProps) => {
  return (
    <LegendWrapper isHover={true}>
      {textKey === LegendKey.CastDetecion && (
        <div className="bg-daube-200 rounded p-1">
          If activated: An algorithm is used to divide the data into three segments (downcast, bottom, upcast) If
          deactivated: Plots over time and over depth are synchronized. The data plotted over depth will be reduced
          according to the time zoom in above diagrams.
        </div>
      )}
      {textKey === LegendKey.Sensitivity && (
        <div className="bg-daube-200 rounded p-1 font-normal		">
          For automatic cast detection the depth data is smoothed by a moving average. You can choose the window half
          size below. A cast is detected, if the vertical speed exceeds a threshold, which you can change below. (If
          this criterion is met by multiple and separate time ranges, the longest time range is taken.)
        </div>
      )}
    </LegendWrapper>
  );
};

export default CastDetectionLegend;
