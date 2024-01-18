import { MapType, MeasurementAnkers } from "@/frontend/enum";
import React from "react";
import Button from "../basic/Button";
import Chart from "../chart/Chart";
import OceanMap from "../map/Map";
import CardWraper from "../wrapper/CardWrapper";
import { MeasurementAnkerTitles } from "@/frontend/constants";
import AnkerMenu from "../navigation/AnkerMenu";
import DeploymentSelection from "../measurement/DeploymentSelection";

const MeasurementData = () => {
  return (
    <div className="flex flex-col">
      <AnkerMenu ankers={MeasurementAnkerTitles} />
      <div className="flex flex-col md:flex-row gap-0 md:gap-4">
        <DeploymentSelection />
      </div>
      <CardWraper text="Parameter over time" hasMap={false} id={MeasurementAnkers.ParameterOverTime}>
        <div>
          <Chart width={300} height={300} tickValue={100} x={"time"} y={"pressure"} title={"Pressure(mbar)"} />
          <Chart width={300} height={300} tickValue={40} x={"time"} y={"temperature"} title={"Temperature(C)"} />
          <Chart width={300} height={300} tickValue={20} x={"time"} y={"conductivity"} title={"Conductivity(ms/cm)"} />
        </div>
      </CardWraper>
      <CardWraper text="Parameter over depths" hasMap={false} id={MeasurementAnkers.ParameterOverDepth}>
        <Chart width={300} height={300} tickValue={100} x={"time"} y={"pressure"} title={"Pressure(mbar)"} />
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
