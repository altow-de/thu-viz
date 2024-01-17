import { MapType } from "@/frontend/enum";
import React, { useState } from "react";
import OceanMap from "../map/Map";
import MeasurementSelection from "../overview/MeasurementSelection";
import TableWrapper from "../table/TableWrapper";
import CardWrapper from "../wrapper/CardWrapper";
import AnkerMenu from "../navigation/AnkerMenu";
import { OverviewAnkers, testData } from "@/frontend/constants";
import PopUpWrapper from "../wrapper/PopUpWrapper";
import Table from "../table/Table";

const Overview = () => {
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  return (
    <div>
      {popUpVisible && (
        <PopUpWrapper title={"Overview Deployment"} onClick={() => setPopUpVisible(false)}>
          <Table data={testData} />
        </PopUpWrapper>
      )}
      <div className="flex flex-col">
        <AnkerMenu ankers={OverviewAnkers} />
        <div className="flex flex-col md:flex-row gap-0 md:gap-4">
          <MeasurementSelection />
          <TableWrapper setPopUpVisible={setPopUpVisible} />
        </div>
        <CardWrapper text={"Position of Deployments (Startposition)"} hasMap={true} id={"position-of-deployments"}>
          <OceanMap type={MapType.point} />
        </CardWrapper>
      </div>
    </div>
  );
};
export default Overview;
