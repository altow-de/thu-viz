import React from "react";
import TableHeader from "./TableHeader";

interface TableProps {
  data: any[];
}

const Table = ({ data }: TableProps) => {
  return (
    <div className="rounded-t-lg shadow-md w-auto h-full bg-white flex flex-col gap-px flex-auto overflow-x-auto">
      <TableHeader titles={data} />
      <div className="flex flex-auto flex-col gap-px flex-auto ">
        {data.map((dataItem, index) => {
          return (
            <div className="flex-auto flex flex-row bg-white gap-0.5 " key={index}>
              {data.map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`${
                      index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"
                    } flex flex-auto text-center py-2 px-4 items-center justify-center text-danube-900 shrink-0	`}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
