import { useStore } from "@/frontend/store";
import { observer } from "mobx-react-lite";
import { useState } from "react";

/**
 * Switch component.
 *
 * This component renders a toggle switch that can be used to switch between two states.
 *
 * @param {SwitchProps} props - The properties for the Switch component.
 * @param {string} props.style - Additional CSS styles for the switch.
 * @param {string} props.type - The type of the switch (e.g., "table" or "cast").
 * @param {number} [props.dataIndex] - The index of the data in the table (optional).
 * @param {boolean} props.selected - Whether the switch is selected (on) or not (off).
 * @param {function} [props.onSwitch] - Callback function triggered on switch action (optional).
 * @returns {JSX.Element} The rendered switch component.
 */
interface SwitchProps {
  style: string;
  type: string;
  dataIndex?: number;
  selected: boolean;
  onSwitch?: (trigger: boolean) => void;
}

/**
 * Color configuration for different switch types.
 */
const colorObj: Record<string, string> = {
  table: "bg-danube-600 ring-danube-600",
  cast: "bg-green-castcheck ring-green-castcheck",
};

const Switch = ({ style, type, dataIndex, selected, onSwitch }: SwitchProps): JSX.Element => {
  const { data: dataStore } = useStore();
  const [trigger, setTrigger] = useState<boolean>(false);

  /**
   * Handles the switch action.
   * Toggles the state and updates the data store if dataIndex is provided.
   */
  const onTrigger = () => {
    if (dataIndex !== undefined && Number(dataIndex) > -1) {
      dataStore.tableData[dataIndex].showInMap = !dataStore.tableData[dataIndex].showInMap;
      dataStore.setDataChanged(!dataStore.dataChanged);
    }

    setTrigger(!trigger);
    if (onSwitch) onSwitch(!trigger);
  };

  return (
    <div className={`${type === "table" ? `flex flex-col flex-1 items-center py-4 px-2 ${style}` : style}`}>
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
