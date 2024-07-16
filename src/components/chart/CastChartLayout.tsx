import { ParameterDataForDeployment } from "@/backend/services/ProcessedValueService";
import React, { useEffect, useState } from "react";
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

/**
 * A layout component for displaying cast charts.
 * @param {Object} props - The props for the CastChartLayout component.
 * @param {{ [key: string]: CastData }} props.castData - The cast data for the charts.
 * @param {number} props.width - The width of the charts.
 * @param {boolean} props.dataLoading - Flag indicating if the data is still loading.
 * @param {ParameterDataForDeployment[]} props.parameterData - The parameter data for deployment.
 * @param {number[]} [props.xBrushValue] - The initial x brush values.
 * @param {number[]} props.yBrushValue - The initial y brush values.
 * @param {boolean} props.resetCastChart - Flag to reset the cast chart.
 * @param {Function} props.setResetCastChart - Function to set the reset flag for the cast chart.
 * @param {number} props.threshold - The threshold value for sensitivity settings.
 * @param {number} props.windowHalfSize - The window half size value for sensitivity settings.
 * @param {Function} props.setSensitivityValues - Function to set the sensitivity values.
 * @param {Function} props.resetCastData - Function to reset the cast data.
 * @param {Function} props.handleBrushSync - Function to handle brush synchronization.
 * @param {Function} props.handleYBrushEnd - Function to handle the end of a y brush event.
 * @returns {JSX.Element} - The rendered CastChartLayout component.
 */
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
}: CastChartLayoutProps): JSX.Element => {
  const defaultCheckbox = {
    checkbox1: true,
    checkbox2: true,
    checkbox3: true,
  };

  const [onSwitch, setOnSwitch] = useState<boolean>(false);
  const [activeGraph, setActiveGraph] = useState<{ [key: string]: boolean }>(defaultCheckbox);
  const [xCastBrush, setXCastBrush] = useState<number[]>([0, 0]);

  /**
   * Synchronizes the x brush values across all charts.
   * @param {number} x1 - The start x brush value.
   * @param {number} x2 - The end x brush value.
   */
  const syncCastCharts = (x1: number, x2: number) => {
    setXCastBrush([x1, x2]);
  };

  /**
   * Handles changes in the checkbox state and switch state.
   * @param {{ [key: string]: boolean }} checkboxes - The state of the checkboxes.
   * @param {boolean} activeSwitch - The state of the switch.
   */
  const handleChanges = (checkboxes: { [key: string]: boolean }, activeSwitch: boolean) => {
    if (!activeSwitch) setActiveGraph(defaultCheckbox);
    else setActiveGraph(checkboxes);
    setResetCastChart(true);
    setOnSwitch(!activeSwitch);
    handleBrushSync(!activeSwitch);
  };

  /**
   * Sets the applied data for sensitivity values.
   * @param {number} threshold - The threshold value.
   * @param {number} windowHalfSize - The window half size value.
   */
  const setAppliedData = (threshold: number, windowHalfSize: number) => {
    setSensitivityValues(threshold, windowHalfSize);
  };

  useEffect(() => {
    resetCastData();
  }, [onSwitch]);

  return (
    <div className="flex flex-row max-[600px]:flex-wrap">
      <div className="flex flex-1 flex-wrap">
        {(!parameterData || parameterData?.length === 0 || !castData) && <NoDiagramData />}
        {parameterData && parameterData.length > 0 && castData && (
          <CastChartSetter
            setAppliedData={setAppliedData}
            threshold={threshold}
            windowHalfSize={windowHalfSize}
            handleChanges={handleChanges}
          />
        )}
        {parameterData?.map((obj: ParameterDataForDeployment) => (
          <div key={obj.parameter + "-" + obj.sensor_id} className="flex-grow flex justify-center">
            <ChartWrapper dataLoading={dataLoading} width={width}>
              {castData[obj.parameter + "-" + obj.sensor_id] && (
                <CastChart
                  data={castData[obj.parameter + "-" + obj.sensor_id].data}
                  i_down={castData[obj.parameter + "-" + obj.sensor_id].downStartIndex}
                  i_down_end={castData[obj.parameter + "-" + obj.sensor_id].downEndIndex}
                  i_up={castData[obj.parameter + "-" + obj.sensor_id].upStartIndex}
                  i_up_end={castData[obj.parameter + "-" + obj.sensor_id].upEndIndex}
                  unit={obj.unit || ""}
                  width={width}
                  title={obj.parameter || ""}
                  xBrushValue={xCastBrush}
                  syncCastCharts={syncCastCharts}
                  reset={resetCastChart}
                  setResetCastChart={setResetCastChart}
                  onCheck={activeGraph}
                  onSwitch={onSwitch}
                  resetCastData={resetCastData}
                  yBrushValue={yBrushValue}
                  handleYBrushEnd={handleYBrushEnd}
                  sensor_id={obj.sensor_id || 0}
                />
              )}
            </ChartWrapper>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastChartLayout;
