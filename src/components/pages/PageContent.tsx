import MeasurementData from "./MeasurementData";
import Overview from "./Overview";

interface PageContentProps {
  pageIndex: number;
}
const PageContent = ({ pageIndex }: PageContentProps) => {
  switch (pageIndex) {
    case 1:
      return <MeasurementData />;
    default:
      return <Overview />;
  }
};
export default PageContent;
