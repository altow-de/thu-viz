import React, { useState } from "react";
import TableHeader from "./TableHeader";
import Switch from "./Switch";

interface TableProps {
  data: any[];
}

const Table = ({ data }: TableProps) => {
  const colSize = data.length + 1;

  return (
    <div className="overflow-x-scroll">
      <div className="grid grid-rows-1 rounded-t-lg shadow-md bg-white gap-1 min-w-[550px] ">
        <TableHeader titles={data} colSize={colSize} />
        <div className="bg-white">
          {data.map((row, index) => (
            <div key={index} className={`text-center text-danube-900 gap-0.5 ${"grid-rows-" + (colSize - 1)}`}>
              <div className={`grid grid-cols-${colSize} gap-0.5`}>
                {data.map((col, i) => (
                  <div key={"col-" + i} className={` ${index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"} py-2 px-4`}>
                    {col}
                  </div>
                ))}
                <Switch style={`${index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"} py-2 px-4 text-danube-900`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
