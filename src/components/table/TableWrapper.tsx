import React from "react";
import Button from "../basic/Button";
import CardWrapper from "../wrapper/CardWrapper";
import Table from "./Table";
import { OverviewAnkers } from "@/frontend/enum";
import { OverviewDeploymentData } from "@/backend/services/DeploymentService";

interface TableWrapperProps {
  setPopUpVisible: (visible: boolean) => void;
  tableData: OverviewDeploymentData[];
}

const TableWrapper = ({ setPopUpVisible, tableData }: TableWrapperProps) => {
  return (
    <div className="basis-full overflow-x-auto sm:basis-2/3 ">
      <CardWrapper text={"Overview Deployment"} hasMap={false} id={OverviewAnkers.OverviewDeployments}>
        <Table data={tableData} maxHeight={"max-h-64"} />
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
