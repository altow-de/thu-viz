import React, { useState, useEffect } from "react";
import {
  DiagramDataForParameterAndDeployment,
  ParameterDataForDeployment,
} from "@/backend/services/ProcessedValueService";
import Chart from "./Chart";
import ChartWrapper from "./ChartWrapper";
import NoDiagramData from "./NoDiagramData";
import { useStore } from "@/frontend/store";
import { ProcessedValueService } from "@/frontend/services/ProcessedValueService";
import {
  CastData,
  DataPoint,
  UpAndDownCastCalculationService,
} from "@/frontend/services/UpAndDownCastCalculationService";
import { findLongestArray, findShortestArray, o2ptoO2c } from "@/frontend/utils";
import { PythonService } from "@/frontend/services/PythonService";

interface ChartLayoutProps {
  parameterData: ParameterDataForDeployment[];
  logger: number;
  deployment: number;
  setCastData: (castData: { [key: string]: CastData }) => void;
  width: number;
  brushValue: number[];
  handleBrushEnd: (x0: number, x1: number, brushSync: boolean) => void;
  setResetCastChart: (resetCastChart: boolean) => void;
  setDefaultCastData: (castData: { [key: string]: CastData }) => void;
  dataLoading: boolean;
  threshold: number;
  windowHalfSize: number;
  setDataLoading: (dataLoading: boolean) => void;
  brushSync: boolean;
  setCastChartParameter: (castChartParameter: ParameterDataForDeployment[]) => void;
}

/**
 * The ChartLayout component is responsible for fetching data, processing it,
 * and rendering multiple Chart components with their respective data.
 * @param {Object} props - The props for the ChartLayout component.
 * @param {ParameterDataForDeployment[]} props.parameterData - The parameter data for the deployment.
 * @param {number} props.logger - The ID of the logger.
 * @param {number} props.deployment - The ID of the deployment.
 * @param {Function} props.setCastData - Function to set the cast data.
 * @param {number} props.width - The width of the chart.
 * @param {number[]} props.brushValue - The brush values for the chart.
 * @param {Function} props.handleBrushEnd - Function to handle the brush end event.
 * @param {Function} props.setResetCastChart - Function to reset the cast chart.
 * @param {Function} props.setDefaultCastData - Function to set the default cast data.
 * @param {boolean} props.dataLoading - Flag to indicate if the data is loading.
 * @param {number} props.threshold - The threshold value for the cast calculation.
 * @param {number} props.windowHalfSize - The window half size value for the cast calculation.
 * @param {Function} props.setDataLoading - Function to set the data loading state.
 * @param {boolean} props.brushSync - Flag to indicate if the brush should be synchronized.
 * @param {Function} props.setCastChartParameter - Function to set the cast chart parameters.
 * @returns {JSX.Element} - The rendered ChartLayout component.
 */
const ChartLayout = ({
  parameterData,
  logger,
  deployment,
  width,
  setCastData,
  handleBrushEnd,
  brushValue,
  setResetCastChart,
  dataLoading,
  setDataLoading,
  threshold,
  windowHalfSize,
  setDefaultCastData,
  brushSync,
  setCastChartParameter,
}: ChartLayoutProps): JSX.Element => {
  const upAndDownCastCalculationService: UpAndDownCastCalculationService = new UpAndDownCastCalculationService(0.2, 5);
  const [completeParameterData, setCompleteParameterData] = useState<ParameterDataForDeployment[]>(parameterData);
  const pythonService: PythonService = new PythonService();
  const [diagramData, setDiagramData] = useState<{ [key: string]: DiagramDataForParameterAndDeployment[] }>({});
  const { data: dataStore } = useStore();
  const processedValueService: ProcessedValueService = new ProcessedValueService(dataStore);

  useEffect(() => {
    setDataLoading(true);

    /**
     * Fetches the salinity data by calling a Python script.
     * @param {any[]} measurements - The measurements data.
     * @returns {Promise<any>} - The response from the Python script.
     */
    const getSalinity = async (measurements: any[]): Promise<any> => {
      return pythonService.callPythonScript(measurements).then((res) => res);
    };

    if (!parameterData) return;

    let castDataObj: { [key: string]: CastData } = {};

    Promise.all(
      parameterData.map(async (obj: ParameterDataForDeployment) => {
        const data = (await processedValueService.getDiagramDataForParameterAndDeployment(
          deployment,
          logger,
          obj.sensor_type_id || 0
        )) as DiagramDataForParameterAndDeployment[];

        const tmp = upAndDownCastCalculationService.execute(data as unknown as DataPoint[]);
        castDataObj[obj.parameter + "-" + obj.sensor_id] = tmp;

        return data.map((d) => ({
          ...d,
          measuring_time: new Date(d.measuring_time),
          value: parseFloat(d.value || ""),
        }));
      })
    )
      .then((results) => {
        const newData: any = Object.fromEntries(
          parameterData.map((obj, index) => [obj.parameter + "-" + obj.sensor_id, results[index]])
        );
        const longestArray = findLongestArray(results);
        const shortestArray = findShortestArray(results);

        const pressureObj = parameterData.find((parameterObj) => parameterObj.parameter === longestArray[0].parameter);
        const pressureArray = longestArray.map((pressureObj: DiagramDataForParameterAndDeployment) => ({
          ...pressureObj,
          parameter: "pressure",
          value: pressureObj.pressure,
        }));
        const maxPressure = Math.max(...pressureArray.map((pressure: any) => Number(pressure.value)));

        const parameterWithPressureData: ParameterDataForDeployment[] = [
          {
            ...pressureObj,
            parameter: "pressure",
            unit: "mbar",
            value: maxPressure,
            sensor_id: 0,
          },
        ].concat(parameterData as any) as unknown as ParameterDataForDeployment[];

        // We have to calculate data for two extra diagrams
        const temperature = parameterData.find(
          (parameterObj) => parameterObj.parameter === "temperature" && parameterObj.unit === "degree_C"
        );
        const conductivity = parameterData.find(
          (parameterObj) => parameterObj.parameter === "conductivity" && parameterObj.unit === "mS_cm-1"
        );
        const oxygen = parameterData.find(
          (parameterObj) => parameterObj.parameter === "oxygen" && parameterObj.unit === "mbar"
        );

        if (temperature && conductivity) {
          let maxSalinity = 0;
          let maxOxygen = 0;

          const measurements = shortestArray.map((item: any) => {
            const time = new Date(item.measuring_time).getTime();
            const temp = newData["temperature-" + temperature.sensor_id]?.find(
              (tempObj: any) => new Date(tempObj.measuring_time).getTime() === time
            );
            const conductivityData = newData["conductivity-" + conductivity.sensor_id]?.find(
              (tempObj: any) => new Date(tempObj.measuring_time).getTime() === time
            );
            if (!conductivityData || !temp) return false;
            const pressure = pressureArray.find((tempObj: any) => new Date(tempObj.measuring_time).getTime() === time);
            return [conductivityData.value, temp.value, pressure.value];
          });

          const filteredMeasurements = measurements.filter((measurement: any) => measurement !== false);

          getSalinity(filteredMeasurements).then((res) => {
            const salinityData = res.data.map((salinity: number, index: number) => {
              maxSalinity = Number(salinity) > maxSalinity ? Number(salinity) : maxSalinity;

              return {
                parameter: "salinity",
                value: salinity,
                measuring_time: newData["temperature-" + temperature.sensor_id][index]?.measuring_time,
                pressure: newData["temperature-" + temperature.sensor_id][index]?.pressure,
                depth: newData["temperature-" + temperature.sensor_id][index]?.depth,
                sensor_id: 0,
              };
            });

            const salinityObj = {
              ...pressureObj,
              parameter: "salinity",
              value: maxSalinity,
              unit: "PSU",
              sensor_id: 0,
            };

            const salinityArray = [{ ...salinityObj }] as any[];
            const tmp = upAndDownCastCalculationService.execute(salinityData as unknown as DataPoint[]);
            castDataObj["salinity-0"] = tmp;

            if (oxygen) {
              const oxygenData = res.data.map((salinity: number, index: number) => {
                const oxy = o2ptoO2c(
                  newData["oxygen-" + oxygen.sensor_id][index]?.value,
                  newData["temperature-" + temperature.sensor_id][index]?.value,
                  salinity,
                  pressureArray[index]?.value
                );
                maxOxygen = Number(oxy) > maxOxygen ? Number(oxy) : maxOxygen;
                return {
                  parameter: "oxygen_per_liter",
                  value: oxy,
                  measuring_time: newData["oxygen-" + oxygen.sensor_id][index]?.measuring_time,
                  pressure: newData["temperature-" + temperature.sensor_id][index]?.pressure,
                  depth: newData["temperature-" + temperature.sensor_id][index]?.depth,
                  sensor_id: 0,
                };
              });

              const oxygenTmp = upAndDownCastCalculationService.execute(oxygenData as unknown as DataPoint[]);
              castDataObj["oxygen_per_liter-0"] = oxygenTmp;

              const oxygenObj = {
                ...pressureObj,
                parameter: "oxygen_per_liter",
                value: maxOxygen,
                unit: "ml/L",
                sensor_id: 0,
              };

              const oxygenArray = [{ ...oxygenObj }] as any[];
              const parameter = parameterWithPressureData.concat(salinityArray).concat(oxygenArray);
              const castParameter = parameterData.concat(salinityArray).concat(oxygenArray);
              setCompleteParameterData(parameter);
              setCastChartParameter(castParameter);

              const completeData = {
                ...newData,
                "salinity-0": salinityData,
                "pressure-0": pressureArray,
                "oxygen_per_liter-0": oxygenData,
              };

              setDiagramData((prevDiagramData) => ({
                ...prevDiagramData,
                ...completeData,
              }));
            } else {
              const parameter = parameterWithPressureData.concat(salinityArray);
              const castParameter = parameterData.concat(salinityArray);
              setCastChartParameter(castParameter);
              setCompleteParameterData(parameter);

              const completeData = {
                ...newData,
                "salinity-0": salinityData,
                "pressure-0": pressureArray,
              };

              setDiagramData((prevDiagramData) => ({
                ...prevDiagramData,
                ...completeData,
              }));
            }

            setDefaultCastData(castDataObj);
          });
        } else {
          setCompleteParameterData(parameterWithPressureData);
          const completeData = { ...newData, "pressure-0": pressureArray };

          setCastChartParameter(parameterData);
          setDiagramData((prevDiagramData) => ({
            ...prevDiagramData,
            ...completeData,
          }));

          setDefaultCastData(castDataObj);
        }
        setResetCastChart(true);
        setDataLoading(false);
      })
      .catch((error) => {
        // Handle error
        console.error("Error fetching data:", error);
        setDataLoading(false);
      });
  }, [parameterData]);

  /**
   * Updates the cast data when the threshold or windowHalfSize changes.
   */
  const changeCastData = () => {
    upAndDownCastCalculationService.threshold = threshold;
    upAndDownCastCalculationService.windowHalfSize = windowHalfSize;

    setDataLoading(true);
    if (!completeParameterData) return;
    let castDataObj: { [key: string]: CastData } = {};
    completeParameterData.map(async (obj: ParameterDataForDeployment) => {
      const tmp = upAndDownCastCalculationService.execute(
        diagramData[obj.parameter + "-" + obj.sensor_id] as unknown as DataPoint[]
      );
      castDataObj[obj.parameter + "-" + obj.sensor_id] = tmp;
    });

    setCastData(castDataObj);
    setResetCastChart(true);
    setDataLoading(false);
  };

  useEffect(() => {
    changeCastData();
  }, [threshold, windowHalfSize]);

  return (
    <div className="flex flex-wrap">
      {(!completeParameterData || completeParameterData.length === 0 || logger === -1 || deployment === -1) && (
        <NoDiagramData />
      )}
      {completeParameterData.map((obj: ParameterDataForDeployment) => (
        <div key={obj.parameter + "-" + obj.sensor_id} className=" flex-grow flex justify-center ">
          <ChartWrapper dataLoading={dataLoading} width={width}>
            {diagramData[obj.parameter + "-" + obj.sensor_id] !== undefined && logger > -1 && deployment > -1 && (
              <Chart
                data={diagramData[obj.parameter + "-" + obj.sensor_id]}
                dataObj={obj}
                onLoggerChange={completeParameterData}
                onXBrushEnd={handleBrushEnd}
                width={width}
                xAxisTitle={"time"}
                yAxisTitle={obj.unit || ""}
                title={obj.parameter || ""}
                brushValue={brushValue}
                brushSync={brushSync}
                sensor_id={obj.sensor_id || 0}
              />
            )}
          </ChartWrapper>
        </div>
      ))}
    </div>
  );
};

export default ChartLayout;
