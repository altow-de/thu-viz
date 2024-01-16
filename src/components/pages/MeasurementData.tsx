import { MapType } from "@/frontend/enum";
import React from "react";
import Button from "../basic/Button";
import Chart from "../chart/Chart";
import OceanMap from "../map/Map";
import CardWraper from "../wrapper/CardWrapper";

const MeasurementData = () => {
  return (
    <div className="">
      <CardWraper text="Parameter over time" hasMap={false} id="parameter-over-time">
        <Chart width={300} height={300} tickValue={100} x={"time"} y={"pressure"} title={"Pressure(mbar)"} />
        <Chart width={300} height={300} tickValue={40} x={"time"} y={"temperature"} title={"Temperature(C)"} />
        <Chart width={300} height={300} tickValue={20} x={"time"} y={"conductivity"} title={"Conductivity(ms/cm)"} />
      </CardWraper>
      <CardWraper text={"Position of Deployments (Startposition)"} hasMap={true} id="position-of-deployments">
        <OceanMap type={MapType.route} />
      </CardWraper>
      <div className="flex justify-center">
        <Button text={"Export plots"} />
      </div>
    </div>
  );
};
export default MeasurementData;
