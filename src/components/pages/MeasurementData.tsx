import { MapType, MeasurementAnkers } from "@/frontend/enum";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "../basic/Button";
import OceanMap from "../map/Map";
import CardWraper from "../wrapper/CardWrapper";
import { MeasurementAnkerTitles } from "@/frontend/constants";
import AnkerMenu from "../navigation/AnkerMenu";
import DeploymentSelection from "../measurement/DeploymentSelection";
import Metadata from "../measurement/Metadata";
import { DeploymentTableData } from "@/frontend/types";
import { DeploymentService } from "@/frontend/services/DeploymentService";
import { ProcessedValueService } from "@/frontend/services/ProcessedValueService";
import { useStore } from "@/frontend/store";
import ChartLayout from "../chart/ChartLayout";
import { ParameterDataForDeployment, TrackData } from "@/backend/services/ProcessedValueService";
import CastChartLayout from "../chart/CastChartLayout";
import { CastData } from "@/frontend/services/UpAndDownCastCalculationService";
import { convertChartToPNG, createAndDownloadZip } from "@/frontend/utils";
import ZoomLegend from "../chart/ZoomLegend";

const MeasurementData = () => {
  const { data: dataStore } = useStore();
  const [windowHalfSize, setWindowHalfSize] = useState<number>(5);
  const [threshold, setThreshold] = useState<number>(0.2);
  const [deployment, setDeployment] = useState<number>(dataStore.selectedColumn.deployment_id || -1);
  const [logger, setLogger] = useState<number>(dataStore.selectedColumn.logger_id || -1);
  const [tableData, setTableData] = useState<DeploymentTableData | undefined>();
  const [chartWidth, setChartWidth] = useState(window.innerWidth > 370 ? 300 : window.innerWidth - 70);
  const [castData, setCastData] = useState<{ [key: string]: CastData }>({});
  const [defaultCastData, setDefaultCastData] = useState<{
    [key: string]: CastData;
  }>({});
  const [xBrush, setXBrush] = useState<number[]>([0, 0]);
  const [yBrush, setYBrush] = useState<number[]>([0, 0]);
  const [brushSync, setBrushSync] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [resetCastChart, setResetCastChart] = useState<boolean>(false);
  const oceanMapRef = useRef(null);
  const [exportChartIDs, setExportChartIDs] = useState<string[]>([]);

  const [parameterDataForDeployment, setParameterDataForDeployment] = useState<
    ParameterDataForDeployment[] | undefined
  >(undefined);
  const [trackData, setTrackData] = useState<TrackData[]>();

  const deploymentService: DeploymentService = new DeploymentService(dataStore);
  const processedValueService: ProcessedValueService = new ProcessedValueService(dataStore);

  const setSensitivityValues = (threshold: number, windowHalfSize: number) => {
    setThreshold(threshold);
    setWindowHalfSize(windowHalfSize);
  };

  const exportMap = () => {
    let blobs: any[] = [];
    oceanMapRef.current.exportMapAsPNG((blob: any) => {
      blobs.push({ blob, filename: "map.png" });
      exportChartIDs.forEach((chartId, index) => {
        const svgElement = document.getElementById(chartId);
        if (svgElement) {
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svgElement);
          const blob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
          });
          blobs.push({ blob, filename: `${chartId}.svg` });
        }
        convertChartToPNG(chartId, (blb) => {
          blobs.push(blb);
          if (blobs.length === exportChartIDs.length * 2 + 1) createAndDownloadZip(blobs);
        });
      });
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth > 370 ? 300 : window.innerWidth - 50);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const setAppliedData = useCallback(
    async (deployment: number, logger: number) => {
      setDeployment(deployment);
      setLogger(logger);

      if (deployment > -1 && logger > -1) {
        const result = await processedValueService.getParameterDataForDeployment(deployment, logger);

        setParameterDataForDeployment(result as unknown as ParameterDataForDeployment[]);
        const exportIDs: string[] = ["pressure-chart"];
        (result as ParameterDataForDeployment[])?.map((res) => {
          exportIDs.push(res.parameter + "-chart");
          exportIDs.push(res.parameter + "-cast_chart");
        });

        setExportChartIDs(exportIDs);
      } else {
        setParameterDataForDeployment([]);
      }
    },
    [setDeployment, setLogger]
  );

  const getDeploymentById = useCallback(async () => {
    if (!deployment || deployment === -1) {
      setTableData(undefined);
      return;
    }
    const data = await deploymentService.getDeploymentById(deployment, logger);
    const res = await processedValueService.getTrackDataByLoggerAndDeployment(deployment, logger);
    setTrackData(res as TrackData[]);
    setTableData(data);
  }, [deployment]);

  useEffect(() => {
    getDeploymentById();
  }, [getDeploymentById]);

  const handleXBrushEnd = (x0: number = 0, x1: number = 0, brushSync: boolean) => {
    setXBrush([x0, x1]);

    if ((x0 === 0 && x1 === 0) || !brushSync) {
      setResetCastChart(true);
      setCastData(defaultCastData);
      return;
    }
    const startDate = new Date(x0);
    const endDate = new Date(x1);
    const filteredData = Object.keys(castData).reduce((acc: { [key: string]: CastData }, key) => {
      const dataPoints = castData[key].data.filter((dataPoint) => {
        return (
          new Date(dataPoint.measuring_time).getTime() >= startDate.getTime() &&
          new Date(dataPoint.measuring_time).getTime() <= endDate.getTime()
        );
      });
      acc[key] = { ...castData[key], data: dataPoints }; // Behalten Sie die Struktur bei, aber aktualisieren Sie die Daten
      return acc;
    }, {});
    setCastData(filteredData);
    setResetCastChart(true);
  };
  const handleYBrushEnd = (y1: number = 0, y0: number = 0) => {
    setYBrush([y1, y0]);
  };

  const handleBrushSync = (brushSync: boolean) => {
    setBrushSync(brushSync);
  };

  const resetCastData = () => {
    setResetCastChart(true);
    setCastData(defaultCastData);
  };

  return (
    <div className="flex flex-col">
      <AnkerMenu ankers={MeasurementAnkerTitles} />
      <div className="flex flex-col md:flex-row gap-0 md:gap-4">
        <DeploymentSelection
          setAppliedData={setAppliedData}
          deployment={dataStore.selectedColumn.deployment_id}
          logger={dataStore.selectedColumn.logger_id}
        />
        <Metadata tableData={tableData} />
      </div>

      <CardWraper text="Parameter over time" hasMap={false} id={MeasurementAnkers.ParameterOverTime}>
        {parameterDataForDeployment && !dataLoading && parameterDataForDeployment.length !== 0 && <ZoomLegend />}
        <ChartLayout
          parameterData={parameterDataForDeployment as ParameterDataForDeployment[]}
          logger={logger}
          deployment={deployment}
          setDefaultCastData={setDefaultCastData}
          setCastData={setCastData}
          width={chartWidth}
          brushValue={xBrush}
          handleBrushEnd={handleXBrushEnd}
          setResetCastChart={setResetCastChart}
          dataLoading={dataLoading}
          setDataLoading={setDataLoading}
          threshold={threshold}
          windowHalfSize={windowHalfSize}
          brushSync={brushSync}
        ></ChartLayout>
      </CardWraper>
      <CardWraper text="Parameter over depths" hasMap={false} id={MeasurementAnkers.ParameterOverDepth}>
        {parameterDataForDeployment && !dataLoading && parameterDataForDeployment.length !== 0 && <ZoomLegend />}
        <CastChartLayout
          parameterData={parameterDataForDeployment as ParameterDataForDeployment[]}
          width={chartWidth}
          dataLoading={dataLoading}
          castData={castData}
          resetCastChart={resetCastChart}
          setResetCastChart={setResetCastChart}
          threshold={threshold}
          windowHalfSize={windowHalfSize}
          setSensitivityValues={setSensitivityValues}
          resetCastData={resetCastData}
          handleBrushSync={handleBrushSync}
          yBrushValue={yBrush}
          handleYBrushEnd={handleYBrushEnd}
        ></CastChartLayout>
      </CardWraper>
      <CardWraper text={"Tracks"} hasMap={true} id={MeasurementAnkers.Track}>
        <OceanMap ref={oceanMapRef} type={MapType.route} data={trackData} />
      </CardWraper>
      <div className="flex justify-center">
        <Button text={"Export plots"} onClick={exportMap} />
      </div>
    </div>
  );
};

export default MeasurementData;
