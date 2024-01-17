import { MapType } from "@/frontend/enum";
import React from "react";
import Button from "../basic/Button";
import Chart from "../chart/Chart";
import OceanMap from "../map/Map";
import CardWraper from "../wrapper/CardWrapper";
import { MeasurementAnkers } from "@/frontend/constants";
import AnkerMenu from "../navigation/AnkerMenu";

const MeasurementData = () => {
  return (
    <div className="">
      <AnkerMenu ankers={MeasurementAnkers} />
      <CardWraper text="Parameter over time" hasMap={false} id="parameter-over-time">
        <div>
          <Chart width={300} height={300} tickValue={100} x={"time"} y={"pressure"} title={"Pressure(mbar)"} />
          <Chart width={300} height={300} tickValue={40} x={"time"} y={"temperature"} title={"Temperature(C)"} />
          <Chart width={300} height={300} tickValue={20} x={"time"} y={"conductivity"} title={"Conductivity(ms/cm)"} />
        </div>
      </CardWraper>
      <CardWraper text="Parameter over depths" hasMap={false} id="parameter-over-depth">
        <Chart width={300} height={300} tickValue={100} x={"time"} y={"pressure"} title={"Pressure(mbar)"} />
      </CardWraper>
      <CardWraper text={"Tracks"} hasMap={true} id="track">
        <OceanMap type={MapType.route} />
      </CardWraper>
      <div className="flex justify-center">
        <Button text={"Export plots"} />
      </div>
    </div>
  );
};
export default MeasurementData;
