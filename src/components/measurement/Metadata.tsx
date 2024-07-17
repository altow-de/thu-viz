import { MeasurementAnchors } from "@/frontend/enum";
import CardWrapper from "../wrapper/CardWrapper";
import SmallTable, { SmallTableProps } from "../table/SmallTable";

/**
 * Metadata component.
 *
 * This component displays a card wrapper containing a small table of metadata.
 *
 * @param {SmallTableProps} tableData - The data to be displayed in the table.
 * @returns {JSX.Element} The Metadata component.
 */
const Metadata = ({ tableData }: SmallTableProps) => {
  return (
    <div className="basis-full md:basis-2/3">
      <CardWrapper text={"Metadata (short selection)"} hasMap={false} id={MeasurementAnchors.Metadata}>
        <SmallTable tableData={tableData} />
      </CardWrapper>
    </div>
  );
};

export default Metadata;
