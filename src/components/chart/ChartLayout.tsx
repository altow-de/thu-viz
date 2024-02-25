import {
  DiagramDataForParameterAndDeployment,
  ParameterDataForDeployment,
} from "@/backend/services/ProcessedValueService";
import Chart from "./Chart";
import React, { useState, useEffect } from "react";
import { useStore } from "@/frontend/store";
import { ProcessedValueService } from "@/frontend/services/ProcessedValueService";

interface ChartLayoutProps {
  parameterData: ParameterDataForDeployment[];
  logger: number;
  deployment: number;
}

const ChartLayout = ({
  parameterData,
  logger,
  deployment,
}: ChartLayoutProps) => {
  const [width, setWidth] = useState(
    window.innerWidth > 370 ? 300 : window.innerWidth - 70
  );
  const [diagramData, setDiagramData] = useState<{
    [key: string]: DiagramDataForParameterAndDeployment[];
  }>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [brush, setBrush] = useState<number[]>([0, 0]);
  const { data: dataStore } = useStore();
  const processedValueService: ProcessedValueService = new ProcessedValueService(
    dataStore
  );

  useEffect(() => {
    setDataLoading(true);
    if (!parameterData) return;

    Promise.all(
      parameterData.map(async (obj: ParameterDataForDeployment) => {
        const data = await processedValueService.getDiagramDataForParameterAndDeployment(
          deployment,
          logger,
          obj.parameter
        );

        return data.map((d) => ({
          ...d,
          measuring_time: new Date(d.measuring_time),
          value: parseFloat(d.value),
        }));
      })
    )
      .then((results) => {
        const newData = Object.fromEntries(
          parameterData.map((obj, index) => [obj.parameter, results[index]])
        );
        setDiagramData((prevDiagramData) => ({
          ...prevDiagramData,
          ...newData,
        }));
        setDataLoading(false);
      })
      .catch((error) => {
        // Handle error
        console.error("Error fetching data:", error);
        setDataLoading(false);
      });
  }, [parameterData]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth > 370 ? 300 : window.innerWidth - 50);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBrushEnd = (x0: number = 0, x1: number = 0) => {
    setBrush([x0, x1]);
  };
  return (
    <div className="flex flex-wrap">
      {parameterData?.map((obj: ParameterDataForDeployment, i) => {
        return (
          <div key={obj.parameter} className=" flex-grow flex justify-center ">
            {dataLoading ? (
              <img
                className="z-0"
                src="pulse_load.svg"
                width={width}
                height={300}
              />
            ) : (
              diagramData[obj.parameter] !== undefined &&
              logger > -1 &&
              deployment > -1 && (
                <Chart
                  data={diagramData[obj.parameter]}
                  dataObj={obj}
                  onLoggerChange={parameterData}
                  onXBrushEnd={handleBrushEnd}
                  brushValue={brush}
                  width={width}
                  xAxisTitle={"time"}
                  yAxisTitle={obj.parameter}
                  title={
                    obj.parameter
                      ? obj.parameter?.charAt(0).toUpperCase() +
                        obj.parameter.slice(1)
                      : ""
                  }
                />
              )
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChartLayout;
