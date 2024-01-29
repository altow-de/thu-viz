import React, { useState } from "react";
import TableHeader from "./TableHeader";
import Switch from "./Switch";

interface TableProps {
  data: any[];
}

const Table = ({ data }: TableProps) => {
  const colSize = data.length + 1;

  const [tableData, setTableData] = useState<any[]>(data);
  const [sorted, setSorted] = useState<boolean>(false);
  /**
   * Sorts the table data based on the specified direction and column key.
   * @param {string} direction - The sorting direction ('up' or 'down').
   * @param {string} column_key - The key of the column to be sorted.
   */
  const sort = (direction: string, column_key: string) => {
    const type = typeof data.find((item) => item[column_key as keyof any] !== null)?.[column_key as keyof any];
    let sortedData: any[] = [];
    if (type === "number" && direction === "down") {
      sortedData = data.sort((a, b) => {
        const numA: number = Number(Object(a)[column_key]);
        const numB: number = Number(Object(b)[column_key]);

        if (numA === null || numA === undefined || isNaN(numA)) {
          return 1;
        }
        if (numB === null || numB === undefined || isNaN(numB)) {
          return -1;
        }

        return numB - numA;
      });
    }
    if (type === "number" && direction === "up")
      sortedData = data.sort((a, b) => {
        const numA: number = Number(Object(a)[column_key]);
        const numB: number = Number(Object(b)[column_key]);

        if (numA === null || numA === undefined || isNaN(numA)) {
          return 1;
        }
        if (numB === null || numB === undefined || isNaN(numB)) {
          return -1;
        }

        return numA - numB;
      });

    if (type !== "number" && direction === "up") {
      sortedData = data.sort((a, b) => {
        const strA: string = String(Object(a)[column_key]);
        const strB: string = String(Object(b)[column_key]);
        if (strA === null || strA === undefined) {
          return strB === null || strB === undefined ? 0 : -1;
        }
        if (strB === null || strB === undefined) {
          return 1;
        }
        return strB.localeCompare(strA);
      });
    }
    if (type !== "number" && direction === "down") {
      sortedData = data.sort((a, b) => {
        const strA: string = String(Object(a)[column_key]);
        const strB: string = String(Object(b)[column_key]);

        if (strA === null || strA === undefined) {
          return strB === null || strB === undefined ? 0 : -1;
        }

        if (strB === null || strB === undefined) {
          return 1;
        }
        return strA.localeCompare(strB);
      });
    }
    setTableData(sortedData);
    setSorted(!sorted);
  };

  return (
    <div className="overflow-x-auto rounded-t-lg shadow-md">
      <div className="grid grid-rows-1 bg-white gap-1 min-w-[550px]">
        <TableHeader titles={data} sort={sort} />
        <div className="bg-white">
          {tableData.map((row, index) => (
            <div
              key={index}
              className={`text-center text-danube-900  ${index !== data.length - 1 ? "border-white border-b-2" : ""}`}
            >
              <div className={`grid grid-cols-6 gap-0.5 bg-white`}>
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
