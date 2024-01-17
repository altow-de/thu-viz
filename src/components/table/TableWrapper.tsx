import React, { useState } from "react";
import Button from "../basic/Button";
import CardWrapper from "../wrapper/CardWrapper";
import Table from "./Table";

interface TableWrapperProps {
  setPopUpVisible: (visible: boolean) => void;
}
const data = ["title 1", "title 2", "title 3", "title 4", "title 5"];

const TableWrapper = ({ setPopUpVisible }: TableWrapperProps) => {
  return (
    <div className="basis-full overflow-x-scroll sm:basis-2/3 ">
      <CardWrapper text={"Overview Deployment"} hasMap={false} id={"overview-deployments"}>
        <Table data={data} />
        <div className="mt-4 flex justify-center">
          <Button
            text={"Show all"}
            onClick={(event: React.MouseEvent<Element, MouseEvent>) => {
              setPopUpVisible(true);
            }}
          />
        </div>
      </CardWrapper>
    </div>
  );
};

export default TableWrapper;
