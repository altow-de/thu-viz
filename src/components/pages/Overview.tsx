import { MapType, OverviewAnchors } from "@/frontend/enum";
import React, { useCallback, useEffect, useState } from "react";

import MeasurementSelection from "../overview/MeasurementSelection";
import TableWrapper from "../table/TableWrapper";
import CardWrapper from "../wrapper/CardWrapper";
import AnchorMenu from "../navigation/AnchorMenu";
import { OverviewAnchorTitles } from "@/frontend/constants";
import PopUpWrapper from "../wrapper/PopUpWrapper";
import Table from "../table/Table";
import { DeploymentService } from "@/frontend/services/DeploymentService";
import { useStore } from "@/frontend/store";
import { OverviewDeploymentTrackData, Region, SwitchTableData } from "@/frontend/types";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
const OceanMap = dynamic(() => import("../map/Map"), {
  ssr: false,
});

/**
 * Overview component.
 *
 * This component provides an overview of selected measurement data,
 * including a measurement selection, a table of deployment data, and a map of track data.
 *
 * @returns {JSX.Element} The Overview component.
 */
const Overview = (): JSX.Element => {
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const [overviewDeploymentTrackData, setOverviewDeploymentTrackData] = useState<SwitchTableData[]>([]);
  const { data: dataStore } = useStore();
  const deploymentService: DeploymentService = new DeploymentService(dataStore);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [region, setRegion] = useState<Region>();
  const [platform, setPlatform] = useState<number>(-1);
  const [applyClicked, setApplyClicked] = useState<boolean>(false);
  const [trackData, setTrackData] = useState<OverviewDeploymentTrackData[]>([]);

  /**
   * Retrieves the overview deployment data by time, platform, and region.
   * Sets the deployment track data and updates the data store.
   */
  const getOverviewDeploymentDataByTimePlatformAndRegion = useCallback(async () => {
    const res = await deploymentService.getOverviewDeploymentDataByTimePlatformAndRegion(
      region || undefined,
      platform || undefined,
      startDate || undefined,
      endDate || undefined
    );
    const completeArray = res.map((obj: SwitchTableData) => {
      return { ...obj, showInMap: true };
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
        <PopUpWrapper title={"Overview of selected measurement data"} onClick={() => setPopUpVisible(false)}>
          <Table data={overviewDeploymentTrackData} maxHeight={"max-h-96"} />
        </PopUpWrapper>
      )}
      <div className="flex flex-col">
        <AnchorMenu anchors={OverviewAnchorTitles} />
        <div className="flex flex-col md:flex-row gap-0 md:gap-4 ">
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
          text={"Measurement locations (start positions of deployments)"}
          hasMap={true}
          id={OverviewAnchors.PositionOfDeployments}
        >
          <OceanMap type={MapType.point} data={trackData} region={region} />
        </CardWrapper>
      </div>
    </div>
  );
};

export default observer(Overview);
