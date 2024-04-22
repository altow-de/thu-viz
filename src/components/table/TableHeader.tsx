import React, { LegacyRef, useState } from "react";
import Sort from "./Sort";
import { useStore } from "@/frontend/store";
import { SwitchTableData } from "@/frontend/types";
import { useClickAway } from "@uidotdev/usehooks";

interface TableHeaderProps {
  titles: {};
  sort: (direction: string, column_key: string) => void;
  textSize?: string;
  tableData: SwitchTableData[];
  hasTableWrapper?: boolean;
}

const TableHeader = ({ titles, sort, textSize, tableData, hasTableWrapper }: TableHeaderProps) => {
  const [selected, setSelected] = useState<string>(Object.keys(titles)[0] + "_up");
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const { data: dataStore } = useStore();
  const ref = useClickAway(() => {
    setPopUpVisible(false);
  }) as LegacyRef<HTMLDivElement>;

  const onArrowUp = (column_key: string) => {
    setSelected(column_key + "_up");
    if (sort) sort("up", column_key);
  };
  const onArrowDown = (column_key: string) => {
    setSelected(column_key + "_down");
    if (sort) sort("down", column_key);
  };

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
          className="flex-inital w-1 justify-self-end ml-1 flex flex-col mt-0.5 cursor-pointer"
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
