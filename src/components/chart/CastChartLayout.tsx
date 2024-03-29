import { ParameterDataForDeployment } from "@/backend/services/ProcessedValueService";
import React, { useState } from "react";
import { CastData } from "@/frontend/services/UpAndDownCastCalculationService";
import CastChart from "./CastChart";
import ChartWrapper from "./ChartWrapper";
import NoDiagramData from "./NoDiagramData";
import CastChartSetter from "./CastChartSetter";

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
  const [onSwitch, setOnSwitch] = useState<boolean>(false);
  const [activeGraph, setActiveGraph] = useState<{ [key: string]: boolean }>({
    checkbox1: true,
    checkbox2: true,
    checkbox3: true,
  });
  const [xCastBrush, setXCastBrush] = useState<number[]>([0, 0]);

  const syncCastCharts = (x1: number, x2: number) => {
    setXCastBrush([x1, x2]);
  };

  const setAppliedData = (
    checkboxes: { [key: string]: boolean },
    activeSwitch: boolean
  ) => {
    setActiveGraph(checkboxes);
    setOnSwitch(activeSwitch);
  };

  return (
    <div className="flex flex-row max-[600px]:flex-wrap">
      <div className="flex flex-1 flex-wrap">
        {(!parameterData || parameterData?.length === 0 || !castData) && (
          <NoDiagramData />
        )}
        {parameterData && parameterData?.length > 0 && castData && (
          <CastChartSetter setAppliedData={setAppliedData} />
        )}
        {parameterData?.map((obj: ParameterDataForDeployment) => {
          return (
            <div
              key={obj.parameter}
              className=" flex-grow flex justify-center "
            >
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
                    onCheck={activeGraph}
                    onSwitch={onSwitch}
                  />
                )}
              </ChartWrapper>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CastChartLayout;
