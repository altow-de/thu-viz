import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import Switch from "./Switch";
import { OverviewDeploymentData } from "@/backend/services/DeploymentService";
import { DateTimeLocaleOptions, TableTitle } from "@/frontend/constants";
import convert from "convert";
import { getTimeObjectForSort } from "@/frontend/utils";

interface TableProps {
  data: OverviewDeploymentData[];
  maxHeight?: string;
  textSize?: string;
}

const Table = ({ data, maxHeight, textSize }: TableProps) => {
  const [tableData, setTableData] = useState<OverviewDeploymentData[]>(data);
  const [sorted, setSorted] = useState<boolean>(false);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const formatColVal = (colObj: OverviewDeploymentData, colKey: string) => {
    const value = Object(colObj)[colKey];

    switch (colKey) {
      case "time_start":
        return value ? new Date(value.toString()).toLocaleString("de-DE", DateTimeLocaleOptions) : "no data";
      case "time_end":
        const converted = convert(
          new Date(value).getTime() - new Date(Object(colObj)["time_start"]).getTime(),
          "ms"
        ).to("best");
        return converted.quantity.toFixed(0) + converted.unit;
      case "deepest":
        const num = (Number(value) * -1).toFixed(1);
        return num + "m";
      default:
        return value;
    }
  };

  /**
   * Sorts the table data based on the specified direction and column key.
   * @param {string} direction - The sorting direction ('up' or 'down').
   * @param {string} column_key - The key of the column to be sorted.
   */
  const sort = (direction: string, column_key: string) => {
    const type = typeof data.find((item) => item[column_key as keyof OverviewDeploymentData] !== null)?.[
      column_key as keyof OverviewDeploymentData
    ];

    let sortedData: OverviewDeploymentData[] = [];
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

    if (column_key === "time_end" && direction === "down") {
      sortedData = data.sort((a, b) => {
        const numA: number = getTimeObjectForSort(formatColVal(a, column_key));
        const numB: number = getTimeObjectForSort(formatColVal(b, column_key));

        if (numA === null || numA === undefined || isNaN(numA)) {
          return 1;
        }
        if (numB === null || numB === undefined || isNaN(numB)) {
          return -1;
        }

        return numB - numA;
      });
    }
    if (column_key === "time_end" && direction === "up")
      sortedData = data.sort((a, b) => {
        const numA: number = getTimeObjectForSort(formatColVal(a, column_key));
        const numB: number = getTimeObjectForSort(formatColVal(b, column_key));

        if (numA === null || numA === undefined || isNaN(numA)) {
          return 1;
        }
        if (numB === null || numB === undefined || isNaN(numB)) {
          return -1;
        }

        return numA - numB;
      });

    if (type !== "number" && direction === "up" && column_key !== "time_end") {
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
    if (type !== "number" && direction === "down" && column_key !== "time_end") {
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
      <div className={`grid grid-rows-1 bg-white gap-1 min-w-[800px] ${textSize === "small" ? "text-xs" : "text-sm"}`}>
        <TableHeader titles={TableTitle} sort={sort} textSize={textSize} />
        <div className={`bg-white ${maxHeight}`}>
          {tableData?.map((row, index) => (
            <div
              key={index}
              className={`text-center text-danube-900  ${index !== data.length - 1 ? "border-white border-b-2" : ""}`}
            >
              <div className={`grid grid-cols-7 gap-0.5 bg-white ${maxHeight}`}>
                {Object.values(row).map((col, i) => (
                  <div
                    key={"col-" + i}
                    className={` ${index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"} py-3 px-2 self-center h-full`}
                  >
                    {formatColVal(row as OverviewDeploymentData, Object.keys(row)[i])}
                  </div>
                ))}
                <Switch style={`${index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"} py-3 px-2 text-danube-900`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
