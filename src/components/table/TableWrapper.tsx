import React, { useEffect } from "react";
import Button from "../basic/Button";
import CardWrapper from "../wrapper/CardWrapper";
import Table from "./Table";
import { OverviewAnkers } from "@/frontend/enum";
import { SwitchTableData } from "@/frontend/types";
import { observer } from "mobx-react-lite";

interface TableWrapperProps {
  setPopUpVisible: (visible: boolean) => void;
  tableData: SwitchTableData[];
}

const TableWrapper = ({ setPopUpVisible, tableData }: TableWrapperProps) => {
  return (
    <div className="relative basis-full overflow-x-auto sm:basis-2/3 ">
      <CardWrapper
        text={"Overview of selected measurement data"}
        hasMap={false}
        id={OverviewAnkers.OverviewDeployments}
      >
        <Table data={tableData} maxHeight={"max-h-64"} hasTableWrapper={true} />
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

export default observer(TableWrapper);
