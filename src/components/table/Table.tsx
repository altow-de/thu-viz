import React, { useState } from "react";
import TableHeader from "./TableHeader";
import Switch from "./Switch";

interface TableProps {
  data: any[];
}

const Table = ({ data }: TableProps) => {
  const colSize = data.length + 1;

  return (
    <div className="overflow-x-scroll  rounded-t-lg shadow-md ">
      <div className="grid grid-rows-1 bg-white gap-1 min-w-[550px]">
        <TableHeader titles={data} colSize={colSize} />
        <div className="bg-white  max-h-96">
          {data.map((row, index) => (
            <div
              key={index}
              className={`text-center text-danube-900 grid ${"grid-rows-" + (colSize - 1)} ${
                index !== data.length - 1 ? "border-white border-b-2" : ""
              }`}
            >
              <div className={`grid grid-cols-${colSize} gap-0.5 bg-white`}>
                {data.map((col, i) => (
                  <div
                    key={"col-" + i}
                    className={` ${index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"} py-3 px-4 self-center`}
                  >
                    {col}
                  </div>
                ))}
                <Switch style={`${index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"} py-3 px-4 text-danube-900`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
