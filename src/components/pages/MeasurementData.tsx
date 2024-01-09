import Chart from "../chart/Chart";
import CardWraper from "../wrapper/CardWrapper";

const MeasurementData = () => {
  return (
    <div>
      <CardWraper text="Parameter over time" hasMap={false}>
        <Chart
          width={300}
          height={300}
          tickValue={4}
          x={"time"}
          y={"pressure"}
          title={"Pressure(mbar)"}
        />
        <Chart
          width={300}
          height={300}
          tickValue={10}
          x={"time"}
          y={"temperature"}
          title={"Temperature(C)"}
        />
        <Chart
          width={300}
          height={300}
          tickValue={14}
          x={"time"}
          y={"conductivity"}
          title={"Conductivity(ms/cm)"}
        />
      </CardWraper>
    </div>
  );
};
export default MeasurementData;
