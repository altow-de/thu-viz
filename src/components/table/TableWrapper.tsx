import React from "react";
import Button from "../basic/Button";
import CardWrapper from "../wrapper/CardWrapper";
import Table from "./Table";

interface TableWrapperProps {}
const data = ["title 1", "title 2", "title 3", "title 4", "title 5"];

const TableWrapper = ({}: TableWrapperProps) => {
  return (
    <div className="basis-full overflow-x-scroll sm:basis-2/3 ">
      <CardWrapper text={"Selection of measurement data"} hasMap={false}>
        <Table data={data} />
        <div className="mt-4 flex justify-center">
          <Button text={"Show all"} />
        </div>
      </CardWrapper>
    </div>
  );
};

export default TableWrapper;