import React from "react";

interface TableHeaderProps {
  titles: string[];
}

const TableHeader = ({ titles }: TableHeaderProps) => {
  return (
    <div className="flex flex-row flex-auto w-full gap-0.5">
      {titles.map((title, index) => {
        return (
          <div
            key={index}
            className="bg-danube-200 flex flex-auto text-center py-2 px-4 font-semibold items-center justify-center text-danube-900 shrink-0	"
          >
            {title}
          </div>
        );
      })}
    </div>
  );
};

export default TableHeader;
