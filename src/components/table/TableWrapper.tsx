import React, { useEffect } from "react";
import Button from "../basic/Button";
import CardWrapper from "../wrapper/CardWrapper";
import Table from "./Table";
import { OverviewAnchors } from "@/frontend/enum";
import { SwitchTableData } from "@/frontend/types";
import { observer } from "mobx-react-lite";

/**
 * TableWrapper component.
 *
 * This component wraps the table displaying the selected measurement data overview and provides a button to show all data in a popup.
 *
 * @param {TableWrapperProps} props - The properties for the TableWrapper component.
 * @param {(visible: boolean) => void} props.setPopUpVisible - Function to set the visibility of the popup.
 * @param {SwitchTableData[]} props.tableData - The data to be displayed in the table.
 * @returns {JSX.Element} The rendered TableWrapper component.
 */
interface TableWrapperProps {
  setPopUpVisible: (visible: boolean) => void;
  tableData: SwitchTableData[];
}

const TableWrapper = ({ setPopUpVisible, tableData }: TableWrapperProps): JSX.Element => {
  return (
    <div className="relative basis-full overflow-x-auto sm:basis-2/3 ">
      <CardWrapper
        text={"Overview of selected measurement data"}
        hasMap={false}
        id={OverviewAnchors.OverviewDeployments}
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
