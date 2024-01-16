import React from "react";

interface TableHeaderProps {
  titles: string[];
  colSize: number;
}

const TableHeader = ({ titles, colSize }: TableHeaderProps) => {
  return (
    <div className={`grid ${"grid-cols-" + colSize} gap-0.5 items-center justify-center`}>
      {titles.map((title, index) => {
        return (
          <div key={index} className={`bg-danube-200 text-center font-semibold  text-danube-900 py-2 px-4 h-full`}>
            {title}
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
