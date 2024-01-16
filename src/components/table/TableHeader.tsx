import React from "react";

interface TableHeaderProps {
  titles: string[];
  colSize: number;
}

const TableHeader = ({ titles, colSize }: TableHeaderProps) => {
  return (
    <div className={`grid ${"grid-cols-" + colSize} gap-0.5`}>
      {titles.map((title, index) => {
        return (
          <div
            key={index}
            className={`bg-danube-200 text-center font-semibold items-center justify-center text-danube-900 py-2 px-4 `}
          >
            {title}
          </div>
        );
      })}
      <div
        key="show_in_map"
        className="bg-danube-200 text-center font-semibold items-center justify-center text-danube-900 py-2 px-4 "
      >
        Show in Map
      </div>
    </div>
  );
};

export default TableHeader;
