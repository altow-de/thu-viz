import { MeasurementAnkers } from "@/frontend/enum";
import CardWrapper from "../wrapper/CardWrapper";
import SmallTable, { SmallTableProps } from "../table/SmallTable";

const Metadata = ({ tableData }: SmallTableProps) => {
  return (
    <div className="basis-full md:basis-2/3">
      <CardWrapper text={"Metadata"} hasMap={false} id={MeasurementAnkers.Metadata}>
        <SmallTable tableData={tableData} />
      </CardWrapper>
    </div>
  );
};
export default Metadata;
