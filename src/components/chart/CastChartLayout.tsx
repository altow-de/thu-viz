import { ParameterDataForDeployment } from "@/backend/services/ProcessedValueService";
import React, { useState } from "react";
import { CastData } from "@/frontend/services/UpAndDownCastCalculationService";
import CastChart from "./CastChart";
import ChartWrapper from "./ChartWrapper";
import NoDiagramData from "./NoDiagramData";

interface CastChartLayoutProps {
  castData: { [key: string]: CastData };
  width: number;
  dataLoading: boolean;
  parameterData: ParameterDataForDeployment[];
  brushValue?: number[];
  brushSync: boolean;
  resetCastChart: boolean;
  setResetCastChart: (resetCastChart: boolean) => void;
}

const CastChartLayout = ({
  castData,
  dataLoading,
  width,
  parameterData,
  brushValue,
  brushSync,
  resetCastChart,
  setResetCastChart,
}: CastChartLayoutProps) => {
  const [xCastBrush, setXCastBrush] = useState<number[]>([0, 0]);
  const syncCastCharts = (x1: number, x2: number) => {
    console.log("aa");
    setXCastBrush([x1, x2]);
  };
  return (
    <div className="flex flex-wrap">
      {(!parameterData || parameterData?.length === 0 || !castData) && <NoDiagramData />}
      {parameterData?.map((obj: ParameterDataForDeployment) => {
        return (
          <div key={obj.parameter} className=" flex-grow flex justify-center ">
            <ChartWrapper dataLoading={dataLoading} width={width}>
              {castData[obj.parameter] && (
                <CastChart
                  data={castData[obj.parameter].data}
                  i_down={castData[obj.parameter].downStartIndex}
                  i_down_end={castData[obj.parameter].downEndIndex}
                  i_up={castData[obj.parameter].upStartIndex}
                  i_up_end={castData[obj.parameter].upEndIndex}
                  width={width}
                  title={obj.parameter}
                  xBrushValue={brushSync ? brushValue : xCastBrush}
                  brushSync={brushSync}
                  syncCastCharts={syncCastCharts}
                  reset={resetCastChart}
                  setResetCastChart={setResetCastChart}
                />
              )}
            </ChartWrapper>
          </div>
        );
      })}
    </div>
  );
};

export default CastChartLayout;
