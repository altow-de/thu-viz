import { MapType } from "@/frontend/enum";
import OceanMap from "../map/Map";
import CardWraper from "../wrapper/CardWrapper";

const Overview = () => {
  return (
    <CardWraper text={"Position of Deployments (Startposition)"} hasMap={true}>
      <OceanMap type={MapType.route} />
    </CardWraper>
  );
};
export default Overview;
