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
  xBrushValue?: number[];
  yBrushValue: number[];
  resetCastChart: boolean;
  setResetCastChart: (resetCastChart: boolean) => void;
  treshold: number;
  windowHalfSize: number;
  setSensitivityValues: (treshold: number, windowHalfSize: number) => void;
  resetCastData: () => void;
  handleBrushSync: (brushSync: boolean) => void;
  handleYBrushEnd: (y1: number, y0: number) => void;
}

const CastChartLayout = ({
  castData,
  dataLoading,
  width,
  parameterData,
  resetCastChart,
  setResetCastChart,
  windowHalfSize,
  treshold,
  setSensitivityValues,
  resetCastData,
  handleBrushSync,
  yBrushValue,
  handleYBrushEnd,
}: CastChartLayoutProps) => {
  const defaultCheckbox = {
    checkbox1: true,
    checkbox2: true,
    checkbox3: true,
  };
  const [onSwitch, setOnSwitch] = useState<boolean>(false);
  const [activeGraph, setActiveGraph] = useState<{ [key: string]: boolean }>(defaultCheckbox);
  const [xCastBrush, setXCastBrush] = useState<number[]>([0, 0]);

  const syncCastCharts = (x1: number, x2: number) => {
    setXCastBrush([x1, x2]);
  };

  const setAppliedData = (
    checkboxes: { [key: string]: boolean },
    activeSwitch: boolean,
    treshold: number,
    windowHalfSize: number
  ) => {
    if (activeSwitch) setActiveGraph(defaultCheckbox);
    else setActiveGraph(checkboxes);
    setOnSwitch(activeSwitch);
    handleBrushSync(activeSwitch);
    setSensitivityValues(treshold, windowHalfSize);
  };

  return (
    <div className="flex flex-row max-[600px]:flex-wrap">
      <div className="flex flex-1 flex-wrap">
        {(!parameterData || parameterData?.length === 0 || !castData) && <NoDiagramData />}
        {parameterData && parameterData?.length > 0 && castData && (
          <CastChartSetter
            setAppliedData={setAppliedData}
            treshold={treshold}
            windowHalfSize={windowHalfSize}
            width={width}
          />
        )}
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
                    unit={obj.unit}
                    width={width}
                    title={obj.parameter}
                    xBrushValue={xCastBrush}
                    syncCastCharts={syncCastCharts}
                    reset={resetCastChart}
                    setResetCastChart={setResetCastChart}
                    onCheck={activeGraph}
                    onSwitch={onSwitch}
                    resetCastData={resetCastData}
                    yBrushValue={yBrushValue}
                    handleYBrushEnd={handleYBrushEnd}
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
