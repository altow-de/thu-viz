import Chart from "./Chart2";
import React, { useState, useEffect } from "react";

type ChartLayoutProps = {
  onBrushEnd: any;
  brush: any;
};

const data: {
  pressure: number;
  time: number;
  temperature: number;
  conductivity: number;
}[] = [
  { time: 0, pressure: 1000, temperature: 10.4, conductivity: 20 },
  { time: 1, pressure: 1200, temperature: 12.7, conductivity: 24 },
  { time: 2, pressure: 1400, temperature: 13.2, conductivity: 26 },
  { time: 3, pressure: 1324, temperature: 10.9, conductivity: 29 },
  { time: 4, pressure: 1125, temperature: 11.3, conductivity: 30 },
  { time: 5, pressure: 1627, temperature: 15.2, conductivity: 23 },
  { time: 6, pressure: 1409, temperature: 14.4, conductivity: 22 },
  { time: 7, pressure: 1023, temperature: 12.9, conductivity: 21 },
  { time: 8, pressure: 1234, temperature: 10.1, conductivity: 20 },
  { time: 9, pressure: 1304, temperature: 11.4, conductivity: 14 },
  { time: 10, pressure: 1498, temperature: 12.0, conductivity: 10 },
];

const ChartLayout = ({ brush, onBrushEnd }: ChartLayoutProps) => {
  const [width, setWidth] = useState(
    window.innerWidth > 370 ? 300 : window.innerWidth - 50
  );

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth > 370 ? 300 : window.innerWidth - 50);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-wrap">
      <div className=" flex-grow flex justify-center ">
        <Chart
          data={data}
          onBrushEnd={onBrushEnd}
          brushValue={brush}
          width={width}
          height={300}
          tickValue={100}
          x={"time"}
          y={"pressure"}
          title={"Pressure(mbar)"}
        />
      </div>
      <div className=" flex-grow flex justify-center ">
        <Chart
          data={data}
          onBrushEnd={onBrushEnd}
          brushValue={brush}
          width={width}
          height={300}
          tickValue={40}
          x={"time"}
          y={"temperature"}
          title={"Temperature(C)"}
        />
      </div>
      <div className=" flex-grow flex justify-center ">
        <Chart
          data={data}
          onBrushEnd={onBrushEnd}
          brushValue={brush}
          width={width}
          height={300}
          tickValue={20}
          x={"time"}
          y={"conductivity"}
          title={"Conductivity(ms/cm)"}
        />
      </div>
    </div>
  );
};

export default ChartLayout;
