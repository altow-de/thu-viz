import { MapType } from "@/frontend/enum";
import React from "react";
import OceanMap from "../map/Map";
import MeasurementSelection from "../overview/MeasurementSelection";
import TableWrapper from "../table/TableWrapper";
import CardWrapper from "../wrapper/CardWrapper";
import AnkerMenu from "../navigation/AnkerMenu";
import { OverviewAnkers } from "@/frontend/constants";

const Overview = () => {
  return (
    <div className="flex flex-col">
      <AnkerMenu ankers={OverviewAnkers} />
      <div className="flex flex-col md:flex-row gap-0 md:gap-4">
        <MeasurementSelection />
        <TableWrapper />
      </div>
      <CardWrapper text={"Position of Deployments (Startposition)"} hasMap={true} id={"position-of-deployments"}>
        <OceanMap type={MapType.point} />
      </CardWrapper>
    </div>
  );
};
export default Overview;
