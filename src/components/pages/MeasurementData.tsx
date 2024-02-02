import { MapType, MeasurementAnkers } from "@/frontend/enum";
import React, { useCallback, useEffect, useState } from "react";
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
import { ProcessedValuesForDiagrams } from "@/backend/services/ProcessedValueService";
import ChartLayout from "../chart/ChartLayout";

const MeasurementData = () => {
  const [deployment, setDeployment] = useState<number>(-1);
  const [logger, setLogger] = useState<number>(-1);
  const [tableData, setTableData] = useState<DeploymentTableData | undefined>();
  const [brush, setBrush] = useState<{
    x0: number;
    x1: number;
  }>({ x0: 0, x1: 0 });
  const [
    processedValuesByLoggerAndDeployment,
    setProcessedValuesByLoggerAndDeployment,
  ] = useState<ProcessedValuesForDiagrams | undefined>(undefined);
  const { data: dataStore } = useStore();

  const deploymentService: DeploymentService = new DeploymentService(dataStore);
  const processedValueService: ProcessedValueService = new ProcessedValueService(
    dataStore
  );

  const setAppliedData = useCallback(
    async (deployment: number, logger: number) => {
      setDeployment(deployment);
      setLogger(logger);

      if (deployment > -1 && logger > -1) {
        const result = await processedValueService.getProcessedValuesByDeploymentAndLogger(
          deployment,
          logger
        );
        setProcessedValuesByLoggerAndDeployment(result);
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
    setTableData(data);
  }, [deployment]);

  const handleBrushEnd = (x0: number = 0, x1: number = 0) => {
    setBrush({ x0: x0, x1: x1 });
  };

  useEffect(() => {
    getDeploymentById();
  }, [getDeploymentById]);
  return (
    <div className="flex flex-col">
      <AnkerMenu ankers={MeasurementAnkerTitles} />
      <div className="flex flex-col md:flex-row gap-0 md:gap-4">
        <DeploymentSelection setAppliedData={setAppliedData} />
        <Metadata tableData={tableData} />
      </div>

      <CardWraper
        text="Parameter over time"
        hasMap={false}
        id={MeasurementAnkers.ParameterOverTime}
      >
        <ChartLayout brush={brush} onBrushEnd={handleBrushEnd}></ChartLayout>
      </CardWraper>
      <CardWraper
        text="Parameter over depths"
        hasMap={false}
        id={MeasurementAnkers.ParameterOverDepth}
      >
        <ChartLayout brush={brush} onBrushEnd={handleBrushEnd}></ChartLayout>
      </CardWraper>
      <CardWraper text={"Tracks"} hasMap={true} id={MeasurementAnkers.Track}>
        <OceanMap type={MapType.route} />
      </CardWraper>
      <div className="flex justify-center">
        <Button text={"Export plots"} onClick={() => {}} />
      </div>
    </div>
  );
};

export default MeasurementData;
