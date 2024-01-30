import { Point } from "@/backend/generated-db";
import { DateTimeLocaleOptions, TableDataKeys } from "@/frontend/constants";
import { DeploymentTableData } from "@/frontend/types";

export interface SmallTableProps {
  tableData: DeploymentTableData | undefined;
}

const SmallTable = ({ tableData }: SmallTableProps) => {
  const formatValue = (value: string | Date | Point, dataKey: string) => {
    if (dataKey === "time_start" || dataKey === "time_end")
      return new Date(value.toString()).toLocaleString("de-DE", DateTimeLocaleOptions);

    if (dataKey === "position_start" || dataKey === "position_end")
      return (value as Point).x + ", " + (value as Point).y;
    return value.toString();
  };
  return (
    <div className="shadow-md bg-white">
      {tableData &&
        Object.keys(tableData).map((dataKey) => {
          if (Object(TableDataKeys)[dataKey]) {
            const value = formatValue(Object(tableData)[dataKey], dataKey);

            return (
              <div
                className="flex text-danube-900 text-sm odd:bg-danube-100 even:bg-danube-50 items-center border-white last:border-b-0 border-b flex-col sm:flex-row"
                key={dataKey}
              >
                <div className="flex-0 py-1 px-2 min-w-100% sm:min-w-44">{Object(TableDataKeys)[dataKey]}</div>
                <div className="border-l-0 border-white flex-1 py-1 px-2 sm:border-l-2">{value}</div>
              </div>
            );
          }
        })}
      {!tableData && (
        <div className="px-6 py-20 text-danube-900 text-sm text-center bg-danube-50">
          No data has been applied yet. Choose logger and deployment to apply.
        </div>
      )}
    </div>
  );
};

export default SmallTable;
