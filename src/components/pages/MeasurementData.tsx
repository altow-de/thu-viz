import Chart from "../chart/Chart";
import CardWraper from "../wrapper/CardWrapper";

const MeasurementData = () => {
  return (
    <div>
      <CardWraper text="Parameter over time" hasMap={false}>
        <Chart width={300} height={300} title={"Pressure(mbar)"} />
      </CardWraper>
    </div>
  );
};
export default MeasurementData;
