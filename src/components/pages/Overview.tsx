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
import { OverviewDeploymentTrackData } from "@/backend/services/DeploymentService";
import { DeploymentService } from "@/frontend/services/DeploymentService";
import { useStore } from "@/frontend/store";
import { Region, SwitchTableData } from "@/frontend/types";
import { observer } from "mobx-react-lite";

const Overview = () => {
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const [overviewDeploymentTrackData, setOverviewDeploymentTrackData] = useState<SwitchTableData[]>([]);
  const { data: dataStore } = useStore();
  const deploymentService: DeploymentService = new DeploymentService(dataStore);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [region, setRegion] = useState<Region>();
  const [platform, setPlatform] = useState<number>(-1);
  const [applyClicked, setApplyClicked] = useState<boolean>(false);
  const [trackData, setTrackData] = useState<OverviewDeploymentTrackData[]>([]);

  const getOverviewDeploymentDataByTimePlatformAndRegion = useCallback(async () => {
    const res = await deploymentService.getOverviewDeploymentDataByTimePlatformAndRegion(
      region || undefined,
      platform || undefined,
      startDate || undefined,
      endDate || undefined
    );
    const completeArray = res.map((obj: OverviewDeploymentTrackData) => {
      return { ...obj, showInMap: false };
    });
    setOverviewDeploymentTrackData(completeArray);
    dataStore.setTableData(completeArray);
    const filteredData =
      completeArray.find((obj: SwitchTableData) => obj.showInMap !== undefined) !== undefined
        ? completeArray.filter((obj: SwitchTableData) => obj.showInMap)
        : completeArray;
    setTrackData(filteredData);
  }, [applyClicked]);

  useEffect(() => {
    getOverviewDeploymentDataByTimePlatformAndRegion();
  }, [getOverviewDeploymentDataByTimePlatformAndRegion]);

  useEffect(() => {
    setOverviewDeploymentTrackData(dataStore.tableData);
    const filteredData =
      dataStore.tableData.find((obj) => obj.showInMap !== undefined) !== undefined
        ? dataStore.tableData.filter((obj) => obj.showInMap)
        : dataStore.tableData;
    setTrackData(filteredData);
  }, [dataStore.tableData, dataStore.dataChanged]);

  return (
    <div>
      {popUpVisible && (
        <PopUpWrapper title={"Overview Deployment"} onClick={() => setPopUpVisible(false)}>
          <Table data={overviewDeploymentTrackData} maxHeight={"max-h-96"} />
        </PopUpWrapper>
      )}
      <div className="flex flex-col">
        <AnkerMenu ankers={OverviewAnkerTitles} />
        <div className="flex flex-col md:flex-row gap-0 md:gap-4">
          <MeasurementSelection
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setRegion={setRegion}
            setPlatform={setPlatform}
            applyClicked={applyClicked}
            setApplyClicked={setApplyClicked}
          />
          {!popUpVisible && <TableWrapper setPopUpVisible={setPopUpVisible} tableData={overviewDeploymentTrackData} />}
        </div>
        <CardWrapper
          text={"Position of Deployments (Startposition)"}
          hasMap={true}
          id={OverviewAnkers.PositionOfDeployments}
        >
          <OceanMap type={MapType.point} data={trackData} region={region} />
        </CardWrapper>
      </div>
    </div>
  );
};
export default observer(Overview);
