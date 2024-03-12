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
import ChartLayout from "../chart/ChartLayout";
import { ParameterDataForDeployment, TrackData } from "@/backend/services/ProcessedValueService";

const MeasurementData = () => {
  const { data: dataStore } = useStore();
  const [deployment, setDeployment] = useState<number>(dataStore.selectedColumn.deployment_id || -1);
  const [logger, setLogger] = useState<number>(dataStore.selectedColumn.logger_id || -1);
  const [tableData, setTableData] = useState<DeploymentTableData | undefined>();

  const [parameterDataForDeployment, setParameterDataForDeployment] = useState<
    ParameterDataForDeployment[] | undefined
  >(undefined);
  const [trackData, setTrackData] = useState<TrackData[]>();

  const deploymentService: DeploymentService = new DeploymentService(dataStore);
  const processedValueService: ProcessedValueService = new ProcessedValueService(dataStore);
  const setAppliedData = useCallback(
    async (deployment: number, logger: number) => {
      setDeployment(deployment);
      setLogger(logger);

      if (deployment > -1 && logger > -1) {
        const result = await processedValueService.getParameterDataForDeployment(deployment, logger);

        setParameterDataForDeployment(result as unknown as ParameterDataForDeployment[]);
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
        <ChartLayout
          parameterData={parameterDataForDeployment as ParameterDataForDeployment[]}
          logger={logger}
          deployment={deployment}
        ></ChartLayout>
      </CardWraper>
      {/* <CardWraper
        text="Parameter over depths"
        hasMap={false}
        id={MeasurementAnkers.ParameterOverDepth}
      >
       
      </CardWraper> */}
      <CardWraper text={"Tracks"} hasMap={true} id={MeasurementAnkers.Track}>
        <OceanMap type={MapType.route} data={trackData} />
      </CardWraper>
      <div className="flex justify-center">
        <Button text={"Export plots"} onClick={() => {}} />
      </div>
    </div>
  );
};

export default MeasurementData;
