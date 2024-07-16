import {
  DiagramDataForParameterAndDeployment,
  ParameterDataForDeployment,
} from "@/backend/services/ProcessedValueService";
import Chart from "./Chart";
import React, { useState, useEffect } from "react";
import { useStore } from "@/frontend/store";
import { ProcessedValueService } from "@/frontend/services/ProcessedValueService";
import {
  CastData,
  DataPoint,
  UpAndDownCastCalculationService,
} from "@/frontend/services/UpAndDownCastCalculationService";
import ChartWrapper from "./ChartWrapper";
import NoDiagramData from "./NoDiagramData";
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
}: ChartLayoutProps) => {
  const upAndDownCastCalculationService: UpAndDownCastCalculationService = new UpAndDownCastCalculationService(0.2, 5);
  const [completeParameterData, setCompleteParameterData] = useState<ParameterDataForDeployment[]>(parameterData);
  const pythonService: PythonService = new PythonService();

  const [diagramData, setDiagramData] = useState<{
    [key: string]: DiagramDataForParameterAndDeployment[];
  }>({});

  const { data: dataStore } = useStore();
  const processedValueService: ProcessedValueService = new ProcessedValueService(dataStore);

  useEffect(() => {
    setDataLoading(true);
    const getSalinity = async (measurements: any[]) => {
      return pythonService.callPythonScript(measurements).then((res) => {
        return res;
      });
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
        const pressureArray = longestArray.map((pressureObj: DiagramDataForParameterAndDeployment) => {
          return { ...pressureObj, parameter: "pressure", value: pressureObj.pressure };
        });
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
        //we have to calculate data for two extra diagrams
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
          let maxSanity = 0;
          let maxOxygen = 0;
          const measurements = shortestArray.map((item: any) => {
            const time = new Date(item.measuring_time).getTime();
            const temp = newData["temperature-" + temperature.sensor_id || 0].find(
              (tempObj: any) => new Date(tempObj.measuring_time).getTime() === time
            );
            const conductivityData = newData["conductivity-" + conductivity.sensor_id || 0].find(
              (tempObj: any) => new Date(tempObj.measuring_time).getTime() === time
            );
            if (!conductivityData || !temp) return false;
            const pressure = pressureArray.find((tempObj: any) => new Date(tempObj.measuring_time).getTime() === time);
            return [conductivityData.value, temp.value, pressure.value];
          });
          const filteredMeasurements = measurements.filter((measurement: any) => measurement !== false);
          getSalinity(filteredMeasurements).then((res) => {
            const salinityData = res.data.map((salinity: number, index: number) => {
              maxSanity = Number(salinity) > maxSanity ? Number(salinity) : maxSanity;

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
              value: maxSanity,
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

              const tmp = upAndDownCastCalculationService.execute(oxygenData as unknown as DataPoint[]);
              castDataObj["oxygen_per_liter-0"] = tmp;

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
      {(!completeParameterData || completeParameterData?.length === 0 || logger === -1 || deployment === -1) && (
        <NoDiagramData />
      )}
      {completeParameterData?.map((obj: ParameterDataForDeployment, i) => {
        return (
          <div key={obj.parameter + "-" + obj.sensor_id} className=" flex-grow flex justify-center ">
            <ChartWrapper dataLoading={dataLoading} width={width}>
              {diagramData[obj.parameter + "-" + obj.sensor_id || ""] !== undefined &&
                logger > -1 &&
                deployment > -1 && (
                  <Chart
                    data={diagramData[obj.parameter + "-" + obj.sensor_id || ""]}
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
        );
      })}
    </div>
  );
};

export default ChartLayout;
