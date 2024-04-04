import { useStore } from "@/frontend/store";
import { observer } from "mobx-react-lite";

interface SwitchProps {
  style: string;
  type: string;
  dataIndex: number;
  selected: boolean;
}
const colorObj: Record<string, string> = {
  table: "bg-danube-600 ring-danube-600",
  cast: "bg-green-castcheck ring-green-castcheck",
};
const Switch = ({ style, type, dataIndex, selected }: SwitchProps) => {
  const { data: dataStore } = useStore();

  const onTrigger = () => {
    dataStore.tableData[dataIndex].showInMap = !dataStore.tableData[dataIndex].showInMap;
    dataStore.setDataChanged(!dataStore.dataChanged);
  };

  return (
    <div className={`${type === "table" ? `flex flex-col flex-1 items-center py-4 px-2  ${style}` : style}`}>
      <div className="relative" onClick={onTrigger}>
        <div
          className={`relative w-8 h-4 drop-shadow-md rounded-full cursor-pointer duration-300 ring-1 ${
            selected ? colorObj[type] : " bg-gray-custom ring-gray-custom "
          }`}
        >
          <div
            className={`absolute w-4 h-4 -top-0.5 left-0 cursor-pointer rounded-full drop-shadow-md duration-300 ${
              selected
                ? "translate-x-4 translate-y-[0.13rem] bg-white"
                : "ring-1 translate-y-[0.13rem] bg-white ring-gray-custom"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(Switch);
