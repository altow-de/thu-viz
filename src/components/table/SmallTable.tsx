import { DeploymentTableData } from "@/frontend/types";

export interface SmallTableProps {
  tableData: DeploymentTableData | undefined;
}

const SmallTable = ({ tableData }: SmallTableProps) => {
  return (
    <div className="shadow-md">
      {tableData &&
        Object.keys(tableData).map((dataKey) => {
          return (
            <div key={dataKey}>
              <div>{dataKey}</div>
            </div>
          );
        })}
      {!tableData && <div>no data</div>}
    </div>
  );
};

export default SmallTable;
