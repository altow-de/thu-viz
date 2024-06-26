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
  threshold: number;
  windowHalfSize: number;
  setSensitivityValues: (threshold: number, windowHalfSize: number) => void;
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
  threshold,
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

  const handleChanges = (checkboxes: { [key: string]: boolean }, activeSwitch: boolean) => {
    if (!activeSwitch) setActiveGraph(defaultCheckbox);
    else setActiveGraph(checkboxes);
    setOnSwitch(!activeSwitch);
    handleBrushSync(!activeSwitch);
  };
  const setAppliedData = (threshold: number, windowHalfSize: number) => {
    setSensitivityValues(threshold, windowHalfSize);
  };

  return (
    <div className="flex flex-row max-[600px]:flex-wrap">
      <div className="flex flex-1 flex-wrap">
        {(!parameterData || parameterData?.length === 0 || !castData) && <NoDiagramData />}
        {parameterData && parameterData?.length > 0 && castData && (
          <CastChartSetter
            setAppliedData={setAppliedData}
            threshold={threshold}
            windowHalfSize={windowHalfSize}
            width={width}
            handleChanges={handleChanges}
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
