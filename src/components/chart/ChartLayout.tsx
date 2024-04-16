import {
  DiagramDataForParameterAndDeployment,
  ParameterDataForDeployment,
} from "@/backend/services/ProcessedValueService";
import Chart from "./Chart";
import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "@/frontend/store";
import { ProcessedValueService } from "@/frontend/services/ProcessedValueService";
import {
  CastData,
  DataPoint,
  UpAndDownCastCalculationService,
} from "@/frontend/services/UpAndDownCastCalculationService";
import ChartWrapper from "./ChartWrapper";
import NoDiagramData from "./NoDiagramData";
import { findLongestArray, o2ptoO2c } from "@/frontend/utils";
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
          obj.parameter
        )) as DiagramDataForParameterAndDeployment[];
        const tmp = upAndDownCastCalculationService.execute(data as unknown as DataPoint[]);
        castDataObj[obj.parameter] = tmp;

        return data.map((d) => ({
          ...d,
          measuring_time: new Date(d.measuring_time),
          value: parseFloat(d.value || ""),
        }));
      })
    )
      .then((results) => {
        const newData: any = Object.fromEntries(parameterData.map((obj, index) => [obj.parameter, results[index]]));
        const longestArray = findLongestArray(results);

        const pressureObj = parameterData.find((parameterObj) => parameterObj.parameter === longestArray[0].parameter);
        const pressureArray = longestArray.map((pressureObj: DiagramDataForParameterAndDeployment) => {
          return { ...pressureObj, parameter: "pressure", value: pressureObj.pressure };
        });
        const parameterWithPressureData = [{ ...pressureObj, parameter: "pressure", unit: "mbar" }].concat(
          parameterData
        ) as ParameterDataForDeployment[];
        //we have to calculate data for two extra diagrams

        if (newData.oxygen && newData.temperature && newData.conductivity) {
          let maxSanity = 0;
          let maxOxygen = 0;
          const measurements = newData.temperature.map((temp: any, index: number) => {
            return [newData.conductivity[index].value, temp.value, pressureArray[index].value];
          });
          getSalinity(measurements).then((res) => {
            const salinityData = res.data.map((salinity: number, index: number) => {
              maxSanity = Number(salinity) > maxSanity ? Number(salinity) : maxSanity;
              return { parameter: "salinity", value: salinity, measuring_time: newData.oxygen[index].measuring_time };
            });

            const oxygenData = res.data.map((salinity: number, index: number) => {
              const oxy = o2ptoO2c(
                newData.oxygen[index].value,
                newData.temperature[index].value,
                salinity,
                pressureArray[index].value
              );
              maxOxygen = Number(oxy) > maxOxygen ? Number(oxy) : maxOxygen;
              return {
                parameter: "oxygen_per_liter",
                value: oxy,
                measuring_time: newData.oxygen[index].measuring_time,
              };
            });
            const salinityObj = {
              ...pressureObj,
              parameter: "salinity",
              value: maxSanity,
              unit: "PSO",
            };
            const oxygenObj = {
              ...pressureObj,
              parameter: "oxygen_per_liter",
              value: maxOxygen,
              unit: "ml/L",
            };

            const salinityArray = [{ ...salinityObj }] as any[];
            const oxygenArray = [{ ...oxygenObj }] as any[];
            const parameter = parameterWithPressureData.concat(salinityArray).concat(oxygenArray);
            setCompleteParameterData(parameter);

            const completeData = {
              ...newData,
              salinity: salinityData,
              pressure: pressureArray,
              oxygen_per_liter: oxygenData,
            };

            setDiagramData((prevDiagramData) => ({
              ...prevDiagramData,
              ...completeData,
            }));
          });
        } else {
          setCompleteParameterData(parameterWithPressureData);
          const completeData = { ...newData, pressure: pressureArray };

          setDiagramData((prevDiagramData) => ({
            ...prevDiagramData,
            ...completeData,
          }));
        }

        setDefaultCastData(castDataObj);
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
    if (!parameterData) return;
    let castDataObj: { [key: string]: CastData } = {};
    parameterData.map(async (obj: ParameterDataForDeployment) => {
      const tmp = upAndDownCastCalculationService.execute(diagramData[obj.parameter] as unknown as DataPoint[]);
      castDataObj[obj.parameter] = tmp;
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
          <div key={obj.parameter} className=" flex-grow flex justify-center ">
            <ChartWrapper dataLoading={dataLoading} width={width}>
              {diagramData[obj.parameter] !== undefined && logger > -1 && deployment > -1 && (
                <Chart
                  data={diagramData[obj.parameter]}
                  dataObj={obj}
                  onLoggerChange={completeParameterData}
                  onXBrushEnd={handleBrushEnd}
                  width={width}
                  xAxisTitle={"time"}
                  yAxisTitle={obj.unit}
                  title={obj.parameter}
                  brushValue={brushValue}
                  brushSync={brushSync}
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
