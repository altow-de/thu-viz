import React from "react";
import CardWrapper from "../wrapper/CardWrapper";
import Table from "./Table";

interface TableWrapperProps {}

const TableWrapper = ({}: TableWrapperProps) => {
  return (
    <div className="basis-full sm:basis-2/3 ">
      <CardWrapper text={"Selection of measurement data"} hasMap={false}>
        <Table />
      </CardWrapper>
    </div>
  );
};

export default TableWrapper;
