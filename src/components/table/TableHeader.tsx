import React, { LegacyRef, useState } from "react";
import Sort from "./Sort";
import { useStore } from "@/frontend/store";
import { SwitchTableData } from "@/frontend/types";
import { useClickAway } from "@uidotdev/usehooks";

/**
 * TableHeader component.
 *
 * This component renders the header of the table with sortable columns and a popup menu for showing/hiding all rows on the map.
 *
 * @param {TableHeaderProps} props - The properties for the TableHeader component.
 * @param {{}} props.titles - The titles for the table columns.
 * @param {(direction: string, column_key: string) => void} props.sort - The function to sort the table data.
 * @param {string} [props.textSize] - The text size for the table content.
 * @param {SwitchTableData[]} props.tableData - The data to be displayed in the table.
 * @param {boolean} [props.hasTableWrapper] - Whether the table has a wrapper.
 * @returns {JSX.Element} The rendered table header component.
 */
interface TableHeaderProps {
  titles: {};
  sort: (direction: string, column_key: string) => void;
  textSize?: string;
  tableData: SwitchTableData[];
  hasTableWrapper?: boolean;
}

const TableHeader = ({ titles, sort, textSize, tableData, hasTableWrapper }: TableHeaderProps): JSX.Element => {
  const [selected, setSelected] = useState<string>(Object.keys(titles)[0] + "_up");
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const { data: dataStore } = useStore();
  const ref = useClickAway(() => {
    setPopUpVisible(false);
  }) as LegacyRef<HTMLDivElement>;

  /**
   * Handles the sorting when the up arrow is clicked.
   *
   * @param {string} column_key - The key of the column to be sorted.
   */
  const onArrowUp = (column_key: string) => {
    setSelected(column_key + "_up");
    if (sort) sort("up", column_key);
  };

  /**
   * Handles the sorting when the down arrow is clicked.
   *
   * @param {string} column_key - The key of the column to be sorted.
   */
  const onArrowDown = (column_key: string) => {
    setSelected(column_key + "_down");
    if (sort) sort("down", column_key);
  };

  /**
   * Sets the "show in map" property for all table data.
   *
   * @param {boolean} show_in_map - Whether to show or hide all rows in the map.
   */
  const setShowInMapTableDate = (show_in_map: boolean) => {
    const tmp = tableData.map((obj: SwitchTableData) => {
      return { ...obj, showInMap: show_in_map };
    });
    dataStore.setTableData(tmp);
  };

  return (
    <div
      className={` grid grid-cols-7 gap-0.5 items-center justify-center  ${
        textSize === "small" ? "text-xs" : "text-sm"
      }`}
    >
      {Object.keys(titles).map((titleKey, index) => {
        return (
          <div
            key={index}
            className={`bg-danube-200 text-center font-semibold justify-center items-center text-danube-900 py-3 px-2 h-full flex relative`}
          >
            <div className="flex-1 text-center break-all"> {Object(titles)[titleKey]}</div>
            <div className="flex-inital w-3">
              <Sort onArrowUp={onArrowUp} onArrowDown={onArrowDown} column_key={titleKey} selected={selected} />
            </div>
          </div>
        );
      })}

      <div
        key="show_in_map"
        className=" flex bg-danube-200 text-center font-semibold items-center justify-center text-danube-900 px-2 py-3 h-full"
      >
        <div className="flex-1 text-center " key={"show_in_map"}>
          Show in map
        </div>
        <div
          ref={ref}
          className="flex-inital w-2 justify-self-end ml-1 flex flex-col mt-0.5 cursor-pointer"
          onClick={() => {
            setPopUpVisible(!popUpVisible);
          }}
        >
          <div className="rounded-lg w-[3px] h-[3px] bg-danube-800 mt-px " />
          <div className="rounded-lg w-[3px] h-[3px] bg-danube-800 mt-px " />
          <div className="rounded-lg w-[3px] h-[3px] bg-danube-800 my-px " />
          {popUpVisible && (
            <div
              className={`absolute text-xs cursor-pointer w-16 text-center ${
                hasTableWrapper ? "top-4 right-1" : "-top-10 -right-1"
              }`}
            >
              <div
                className="bg-danube-300 p-1 rounded-t-md hover:font-semibold"
                onClick={() => setShowInMapTableDate(true)}
              >
                Show all
              </div>
              <div
                className="bg-danube-400 p-1 rounded-br-md hover:font-semibold"
                onClick={() => setShowInMapTableDate(false)}
              >
                Hide all
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
