import React, { useState } from "react";
import Sort from "./Sort";

interface TableHeaderProps {
  titles: {};
  sort: (direction: string, column_key: string) => void;
}

const TableHeader = ({ titles, sort }: TableHeaderProps) => {
  const [selected, setSelected] = useState<string>(Object.keys(titles)[0] + "_up");

  const onArrowUp = (column_key: string) => {
    setSelected(column_key + "_up");
    if (sort) sort("up", column_key);
  };
  const onArrowDown = (column_key: string) => {
    setSelected(column_key + "_down");
    if (sort) sort("down", column_key);
  };
  return (
    <div className={`grid grid-cols-7 gap-0.5 items-center justify-center`}>
      {Object.keys(titles).map((titleKey, index) => {
        return (
          <div
            key={index}
            className={`bg-danube-200 text-center font-semibold justify-center items-center text-danube-900 py-2 px-4 h-full flex`}
          >
            <div className="flex-1 text-center break-all"> {Object(titles)[titleKey]}</div>
            <div className="flex-inital w-4">
              <Sort onArrowUp={onArrowUp} onArrowDown={onArrowDown} column_key={titleKey} selected={selected} />
            </div>
          </div>
        );
      })}

      <div
        key="show_in_map"
        className="bg-danube-200 text-center font-semibold items-center justify-center text-danube-900 px-4 py-2 h-full"
      >
        Show in Map
      </div>
    </div>
  );
};

export default TableHeader;
