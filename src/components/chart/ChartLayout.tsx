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
import { findLongestArray } from "@/frontend/utils";

interface ChartLayoutProps {
  parameterData: ParameterDataForDeployment[];
  logger: number;
  deployment: number;
  setCastData: (castData: { [key: string]: CastData }) => void;
  width: number;
  brushValue: number[];
  handleBrushEnd: (x0: number, x1: number) => void;
  setResetCastChart: (resetCastChart: boolean) => void;
  dataLoading: boolean;
  setDataLoading: (dataLoading: boolean) => void;
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
}: ChartLayoutProps) => {
  const upAndDownCastCalculationService: UpAndDownCastCalculationService = new UpAndDownCastCalculationService(0.2, 5);
  const [completeParameterData, setCompleteParameterData] = useState<ParameterDataForDeployment[]>(parameterData);

  const [diagramData, setDiagramData] = useState<{
    [key: string]: DiagramDataForParameterAndDeployment[];
  }>({});

  const { data: dataStore } = useStore();
  const processedValueService: ProcessedValueService = new ProcessedValueService(dataStore);

  useEffect(() => {
    setDataLoading(true);
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
        const newData: {} = Object.fromEntries(parameterData.map((obj, index) => [obj.parameter, results[index]]));
        const longestArray = findLongestArray(results);

        const pressureObj = parameterData.find((parameterObj) => parameterObj.parameter === longestArray[0].parameter);
        const parameterWithPressureData = [{ ...pressureObj, parameter: "pressure", unit: "mbar" }].concat(
          parameterData
        ) as ParameterDataForDeployment[];
        setCompleteParameterData(parameterWithPressureData);
        const pressureArray = longestArray.map((pressureObj: DiagramDataForParameterAndDeployment) => {
          return { ...pressureObj, parameter: "pressure", value: pressureObj.pressure };
        });
        const completeData = { ...newData, pressure: pressureArray };
        setCastData(castDataObj);
        setResetCastChart(true);
        setDiagramData((prevDiagramData) => ({
          ...prevDiagramData,
          ...completeData,
        }));
        setDataLoading(false);
      })
      .catch((error) => {
        // Handle error
        console.error("Error fetching data:", error);
        setDataLoading(false);
      });
  }, [parameterData]);

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
