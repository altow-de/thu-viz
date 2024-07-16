import { Point } from "@/backend/generated-db";
import { DateTimeLocaleOptions, TableDataKeys } from "@/frontend/constants";
import { DeploymentTableData } from "@/frontend/types";

/**
 * SmallTable component.
 *
 * This component renders a table displaying deployment data.
 *
 * @param {SmallTableProps} props - The properties for the SmallTable component.
 * @param {DeploymentTableData | undefined} props.tableData - The data to be displayed in the table.
 * @returns {JSX.Element} The rendered table.
 */
export interface SmallTableProps {
  tableData: DeploymentTableData | undefined;
}

/**
 * Formats the value based on its type and data key.
 *
 * @param {string | Date | Point} value - The value to be formatted.
 * @param {string} dataKey - The key associated with the value.
 * @returns {string} The formatted value.
 */
const formatValue = (value: string | Date | Point, dataKey: string): string => {
  if (dataKey === "time_start" || dataKey === "time_end")
    return value ? new Date(value.toString()).toLocaleString("de-DE", DateTimeLocaleOptions) : "no data";

  if (dataKey === "position_start" || dataKey === "position_end") return `${(value as Point).x}, ${(value as Point).y}`;

  return value.toString();
};

const SmallTable = ({ tableData }: SmallTableProps): JSX.Element => {
  return (
    <div className="shadow-md bg-white">
      {tableData ? (
        Object.keys(tableData).map((dataKey) => {
          if (Object(TableDataKeys)[dataKey]) {
            const value = formatValue((tableData as any)[dataKey], dataKey);
            return (
              <div
                className="flex text-danube-900 text-sm odd:bg-danube-100 even:bg-danube-50 items-center border-white last:border-b-0 border-b flex-col sm:flex-row"
                key={dataKey}
              >
                <div className="flex-0 py-1 px-2 min-w-full sm:min-w-44">{Object(TableDataKeys)[dataKey]}</div>
                <div className="border-l-0 border-white flex-1 py-1 px-2 sm:border-l-2">{value}</div>
              </div>
            );
          }
          return null;
        })
      ) : (
        <div className="px-6 py-20 text-danube-900 text-sm text-center bg-danube-50">
          No data has been applied yet. Choose logger and deployment to apply.
        </div>
      )}
    </div>
  );
};

export default SmallTable;
