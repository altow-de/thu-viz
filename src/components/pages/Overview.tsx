import { MapType, OverviewAnkers } from "@/frontend/enum";
import React, { useCallback, useEffect, useState } from "react";
import OceanMap from "../map/Map";
import MeasurementSelection from "../overview/MeasurementSelection";
import TableWrapper from "../table/TableWrapper";
import CardWrapper from "../wrapper/CardWrapper";
import AnkerMenu from "../navigation/AnkerMenu";
import { OverviewAnkerTitles } from "@/frontend/constants";
import PopUpWrapper from "../wrapper/PopUpWrapper";
import Table from "../table/Table";
import { OverviewDeploymentData } from "@/backend/services/DeploymentService";
import { DeploymentService } from "@/frontend/services/DeploymentService";
import { useStore } from "@/frontend/store";

const Overview = () => {
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const [overviewDeploymentData, setOverviewDeploymentData] = useState<OverviewDeploymentData[]>([]);
  const { data: dataStore } = useStore();
  const deploymentService: DeploymentService = new DeploymentService(dataStore);

  const getOverviewDeploymentData = useCallback(async () => {
    const res = await deploymentService.getOverviewDeploymentData();
    setOverviewDeploymentData(res);
  }, []);

  useEffect(() => {
    getOverviewDeploymentData();
  }, [getOverviewDeploymentData]);

  return (
    <div>
      {popUpVisible && (
        <PopUpWrapper title={"Overview Deployment"} onClick={() => setPopUpVisible(false)}>
          <Table data={overviewDeploymentData} maxHeight={"max-h-96"} />
        </PopUpWrapper>
      )}
      <div className="flex flex-col">
        <AnkerMenu ankers={OverviewAnkerTitles} />
        <div className="flex flex-col md:flex-row gap-0 md:gap-4">
          <MeasurementSelection />
          <TableWrapper setPopUpVisible={setPopUpVisible} tableData={overviewDeploymentData} />
        </div>
        <CardWrapper
          text={"Position of Deployments (Startposition)"}
          hasMap={true}
          id={OverviewAnkers.PositionOfDeployments}
        >
          <OceanMap type={MapType.point} />
        </CardWrapper>
      </div>
    </div>
  );
};
export default Overview;
