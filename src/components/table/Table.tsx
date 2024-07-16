import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import Switch from "./Switch";
import { DateTimeLocaleOptions, TableTitle } from "@/frontend/constants";
import convert from "convert";
import { getDepthFromPressure, getTimeObjectForSort } from "@/frontend/utils";
import { useStore } from "@/frontend/store";
import { OverviewDeploymentTrackData, SwitchTableData } from "@/frontend/types";
import { observer } from "mobx-react-lite";

/**
 * Table component.
 *
 * This component renders a table with data, sorting functionality, and a switch for each row.
 *
 * @param {TableProps} props - The properties for the Table component.
 * @param {SwitchTableData[]} props.data - The data to be displayed in the table.
 * @param {string} [props.maxHeight] - The maximum height of the table.
 * @param {string} [props.textSize] - The text size for the table content.
 * @param {boolean} [props.hasTableWrapper] - Whether the table has a wrapper.
 * @returns {JSX.Element} The rendered table component.
 */
interface TableProps {
  data: SwitchTableData[];
  maxHeight?: string;
  textSize?: string;
  hasTableWrapper?: boolean;
}

const Table = ({ data, maxHeight, textSize, hasTableWrapper }: TableProps): JSX.Element => {
  const [tableData, setTableData] = useState<SwitchTableData[]>(data);
  const [sorted, setSorted] = useState<boolean>(false);
  const { data: dataStore } = useStore();

  useEffect(() => {
    setTableData(data);
  }, [data]);

  /**
   * Formats the column value based on the column key.
   *
   * @param {SwitchTableData} colObj - The column object.
   * @param {string} colKey - The key of the column.
   * @returns {string} The formatted value.
   */
  const formatColVal = (colObj: SwitchTableData, colKey: string): string => {
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
        return getDepthFromPressure(Number(value)).val + "m";
      default:
        return value.toString();
    }
  };

  /**
   * Sorts the table data based on the specified direction and column key.
   *
   * @param {string} direction - The sorting direction ('up' or 'down').
   * @param {string} column_key - The key of the column to be sorted.
   */
  const sort = (direction: string, column_key: string) => {
    const type = typeof data.find((item) => item[column_key as keyof SwitchTableData] !== null)?.[
      column_key as keyof SwitchTableData
    ];

    let sortedData: SwitchTableData[] = [];
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

    if (column_key === "deepest" && direction === "down") {
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
    if (column_key === "deepest" && direction === "up") {
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
    }

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
    if (column_key === "time_end" && direction === "up") {
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
    }
    if (type !== "number" && direction === "up" && column_key !== "time_end" && column_key !== "deepest") {
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
    if (type !== "number" && direction === "down" && column_key !== "time_end" && column_key !== "deepest") {
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
    dataStore.setTableData(sortedData);
    setSorted(!sorted);
  };

  /**
   * Creates a column in the table.
   *
   * @param {number} index - The row index.
   * @param {number} i - The column index.
   * @param {OverviewDeploymentTrackData} row - The row data.
   * @param {string} titleKey - The key of the title.
   * @returns {JSX.Element} The created column.
   */
  const createColumn = (index: number, i: number, row: OverviewDeploymentTrackData, titleKey: string): JSX.Element => {
    if (titleKey === "deployment_id") {
      return (
        <div
          onClick={() => {
            dataStore.setSelectedColumn(Object(row)["logger_id"], Object(row)[titleKey]);
            dataStore.setSelectedNav(1);
          }}
          key={"col-" + i}
          className={` ${
            index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"
          } py-3 px-2 self-center h-full underline font-bold cursor-pointer hover:text-danube-700`}
        >
          {formatColVal(row as SwitchTableData, titleKey)}
        </div>
      );
    }

    return (
      <div
        key={"col-" + i}
        className={` ${index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"} py-3 px-2 self-center h-full`}
      >
        {formatColVal(row as SwitchTableData, titleKey)}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto rounded-t-lg shadow-md">
      {(!tableData || tableData?.length === 0) && (
        <div className="px-6 py-24 text-danube-900 text-sm text-center bg-danube-50">
          No data is available for the entered filter criteria.
        </div>
      )}
      {tableData && tableData?.length > 0 && (
        <div
          className={`grid grid-rows-1 bg-white gap-1 min-w-[800px] ${textSize === "small" ? "text-xs" : "text-sm"}`}
        >
          <TableHeader
            titles={TableTitle}
            sort={sort}
            textSize={textSize}
            tableData={tableData}
            hasTableWrapper={hasTableWrapper}
          />
          <div className={`bg-white ${maxHeight}`}>
            {tableData?.map((row, index) => {
              return (
                <div
                  key={index}
                  className={`text-center text-danube-900  ${
                    index !== data.length - 1 ? "border-white border-b-2" : ""
                  }`}
                >
                  <div className={`grid grid-cols-7 gap-0.5 bg-white ${maxHeight}`}>
                    {Object.keys(TableTitle).map((titleKey, i) => {
                      return createColumn(index, i, row, titleKey);
                    })}
                    <Switch
                      style={`${index % 2 === 0 ? "bg-danube-100" : "bg-danube-50"} py-3 px-2 text-danube-900`}
                      type={"table"}
                      dataIndex={index}
                      selected={tableData[index].showInMap}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(Table);
