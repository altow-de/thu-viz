import React, { useState } from "react";
import Sort from "./Sort";

interface TableHeaderProps {
  titles: string[];
  sort: (direction: string, column_key: string) => void;
}

const TableHeader = ({ titles, sort }: TableHeaderProps) => {
  const [selected, setSelected] = useState<string>(titles[0] + "_up");

  const onArrowUp = (column_key: string) => {
    setSelected(column_key + "_up");
    if (sort) sort("up", column_key);
  };
  const onArrowDown = (column_key: string) => {
    setSelected(column_key + "_down");
    if (sort) sort("down", column_key);
  };
  return (
    <div className={`grid grid-cols-6 gap-0.5 items-center justify-center`}>
      {titles.map((title, index) => {
        return (
          <div
            key={index}
            className={`bg-danube-200 text-center font-semibold justify-center items-center text-danube-900 py-2 px-4 h-full flex`}
          >
            <div className="flex-1 text-center"> {title}</div>
            <div className="flex-inital w-4">
              <Sort onArrowUp={onArrowUp} onArrowDown={onArrowDown} column_key={title} selected={selected} />
            </div>
          </div>
        );
      })}

      <div key="show_in_map" className="bg-danube-200 text-center font-semibold items-center text-danube-900 px-4 py-2">
        Show in Map
      </div>
    </div>
  );
};

export default TableHeader;
