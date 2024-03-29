import Switch from "../table/Switch";
import { useState } from "react";
import Checkbox from "../basic/Checkbox";
import Button from "../basic/Button";
import "../../../styles/colorindicators.css";

interface CastChartSetterProps {
  setAppliedData: (checkboxes: { [key: string]: boolean }, activeSwitch: boolean) => void;
}

const CastChartSetter = ({ setAppliedData }: CastChartSetterProps) => {
  const [switchState, setSwitchState] = useState<boolean>(false);

  const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>({
    checkbox1: true,
    checkbox2: true,
    checkbox3: true,
  });

  const handleCheckboxChange = (checkboxName: string, isChecked: boolean) => {
    setCheckboxes((prevState) => ({
      ...prevState,
      [checkboxName]: isChecked,
    }));
  };

  const onApplyClick = () => {
    setAppliedData(checkboxes, switchState);
  };

  return (
    <div className=" flex-grow flex justify-center ">
      <div className="flex flex-col w-[300px] h-full divide-y divide-danube-200 text-sm text-danube-900">
        <div className="py-4 group">
          <div className=" absolute bg-danube-200 shadow-md -translate-y-20  w-72 h-18 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300">
            If deactivated, the plotted data will be reduced according to the time zoom in above diagramms.
          </div>
          <Switch style={"inline-block"} type={"cast"} onSwitch={setSwitchState} />
          <div className="px-2 -translate-y-[3px] inline-block">Automatic Cast Detection</div>
        </div>
        <div className="py-4">
          <p className="font-semibold py-2">Parts of Deployment</p>
          <Checkbox
            id="checkbox1"
            handleCheckboxChange={handleCheckboxChange}
            checkbox={checkboxes.checkbox1}
            activeSwitch={switchState}
            label={"Downcast"}
          />
          <Checkbox
            id="checkbox2"
            handleCheckboxChange={handleCheckboxChange}
            checkbox={checkboxes.checkbox2}
            activeSwitch={switchState}
            label={"BottomU"}
          />
          <Checkbox
            id="checkbox3"
            handleCheckboxChange={handleCheckboxChange}
            checkbox={checkboxes.checkbox3}
            activeSwitch={switchState}
            label={"Upcast"}
          />
        </div>
        <div className="py-4">
          <p className="font-semibold pt-2">Change sensitivity</p>
          <input
            type="text"
            className="w-full my-5 px-2 py-2 h-10 border placeholder-danube-900 rounded-lg border-danube-200"
            placeholder="Sensitivity value"
          />
          <Button text="Apply" onClick={onApplyClick} />
        </div>
      </div>
    </div>
  );
};

export default CastChartSetter;
