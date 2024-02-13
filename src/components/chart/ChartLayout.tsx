import {
  DiagramDataForParameterAndDeployment,
  ParameterDataForDeployment,
} from "@/backend/services/ProcessedValueService";
import Chart from "./Chart";
import React, { useState, useEffect } from "react";
import { useStore } from "@/frontend/store";
import { ProcessedValueService } from "@/frontend/services/ProcessedValueService";

interface ChartLayoutProps {
  onBrushEnd: any;
  brush: any;
  parameterData: ParameterDataForDeployment[];
  logger: number;
  deployment: number;
}

const data: {
  pressure: number;
  time: number;
  temperature: number;
  conductivity: number;
}[] = [
  { time: 0, pressure: 1000, temperature: 10.4, conductivity: 20 },
  { time: 1, pressure: 1200, temperature: 12.7, conductivity: 24 },
  { time: 2, pressure: 1400, temperature: 13.2, conductivity: 26 },
  { time: 3, pressure: 1324, temperature: 10.9, conductivity: 29 },
  { time: 4, pressure: 1125, temperature: 11.3, conductivity: 30 },
  { time: 5, pressure: 1627, temperature: 15.2, conductivity: 23 },
  { time: 6, pressure: 1409, temperature: 14.4, conductivity: 22 },
  { time: 7, pressure: 1023, temperature: 12.9, conductivity: 21 },
  { time: 8, pressure: 1234, temperature: 10.1, conductivity: 20 },
  { time: 9, pressure: 1304, temperature: 11.4, conductivity: 14 },
  { time: 10, pressure: 1498, temperature: 12.0, conductivity: 10 },
];

const ChartLayout = ({
  brush,
  onBrushEnd,
  parameterData,
  logger,
  deployment,
}: ChartLayoutProps) => {
  const [width, setWidth] = useState(
    window.innerWidth > 370 ? 300 : window.innerWidth - 50
  );
  const [diagramData, setDiagramData] = useState<{
    [key: string]: DiagramDataForParameterAndDeployment[];
  }>([]);
  const [dataLoading, setDataLoading] = useState(false);

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
          processing_time: new Date(d.processing_time),
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

  console.log(diagramData);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth > 370 ? 300 : window.innerWidth - 50);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-wrap">
      {parameterData?.map((obj: ParameterDataForDeployment, i) => {
        return (
          <div key={obj.parameter} className=" flex-grow flex justify-center ">
            {dataLoading ? (
              <img className="z-0" src="pulse.svg" />
            ) : (
              <Chart
                data={diagramData[obj.parameter]}
                dataObj={obj}
                onBrushEnd={onBrushEnd}
                brushValue={brush}
                width={width}
                height={300}
                tickValue={20}
                x={"time"}
                y={obj.parameter}
                title={
                  obj.parameter
                    ? obj.parameter?.charAt(0).toUpperCase() +
                      obj.parameter.slice(1)
                    : ""
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChartLayout;
