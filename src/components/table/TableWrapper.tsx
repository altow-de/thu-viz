import React, { useState } from "react";
import Button from "../basic/Button";
import CardWrapper from "../wrapper/CardWrapper";
import Table from "./Table";
import { testData } from "@/frontend/constants";

interface TableWrapperProps {
  setPopUpVisible: (visible: boolean) => void;
}

const TableWrapper = ({ setPopUpVisible }: TableWrapperProps) => {
  return (
    <div className="basis-full overflow-x-auto sm:basis-2/3 ">
      <CardWrapper text={"Overview Deployment"} hasMap={false} id={"overview-deployments"}>
        <Table data={testData} showSwitch={true} />
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
