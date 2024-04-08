import Switch from "../table/Switch";
import { useEffect, useState } from "react";
import Checkbox from "../basic/Checkbox";
import Button from "../basic/Button";
import "../../../styles/colorindicators.css";

interface CastChartSetterProps {
  setAppliedData: (threshold: number, windowHalfSize: number) => void;
  threshold: number;
  windowHalfSize: number;
  width: number;
  handleChanges: (checkboxes: { [key: string]: boolean }, activeSwitch: boolean) => void;
}

const CastChartSetter = ({ setAppliedData, width, windowHalfSize, threshold, handleChanges }: CastChartSetterProps) => {
  const defaultCheckbox = { checkbox1: true, checkbox2: true, checkbox3: true };

  const [windowHalfSizeVal, setWindowHalfSize] = useState<number>(windowHalfSize);
  const [thresholdVal, setThreshold] = useState<number>(threshold);
  const [switchState, setSwitchState] = useState<boolean>(false);
  const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>(defaultCheckbox);
  const [sensitivityVisible, setSensitivityVisible] = useState<boolean>(false);

  const handleCheckboxChange = (checkboxName: string, isChecked: boolean) => {
    const newCheckboxes = { ...checkboxes, [checkboxName]: isChecked };
    setCheckboxes(newCheckboxes);
    handleChanges(newCheckboxes, switchState);
  };

  const onApplyClick = () => {
    setAppliedData(thresholdVal, windowHalfSizeVal);
  };

  useEffect(() => {
    if (!switchState) setCheckboxes(defaultCheckbox);
    handleChanges(defaultCheckbox, switchState);
  }, [switchState]);

  return (
    <div className={`flex justify-center flex-grow w-[${width}px]`}>
      <div className={`flex flex-col w-[${width}px] h-full divide-y divide-danube-200 text-sm text-danube-900 `}>
        <div className="group relative my-2">
          <div className="absolute bg-danube-200 shadow-md -translate-y-20 w-72 h-18 p-1 rounded-lg hidden group-hover:block transition duration-300 ">
            If deactivated, the plotted data will be reduced according to the time zoom in above diagramms.
          </div>
          <Switch style={"inline-block"} type={"cast"} onSwitch={setSwitchState} selected={!switchState} />
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
        <div
          className={`py-4 w-full ${
            !sensitivityVisible ? "underline underline-offset-[5px] decoration-danube-200" : ""
          }`}
        >
          <div
            className={`font-semibold pt-2 relative cursor-pointer`}
            onClick={() => setSensitivityVisible(!sensitivityVisible)}
          >
            Change sensitivity
            {sensitivityVisible && (
              <div className=" w-0 h-0 border-l-[5px] border-l-transparent  border-b-[6px] border-r-[5px] border-r-transparent right-0 bottom-[13px] mb-[3px] absolute top-3.5 bottom-0 border-b-danube-800"></div>
            )}
            {!sensitivityVisible && (
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-t-[6px] border-r-[5px] border-r-transparent right-0 bottom-[2px] mt-[2px] absolute top-3.5 border-t-danube-800"></div>
            )}
          </div>
          {sensitivityVisible && (
            <div>
              <div className="mt-2 ">
                <input
                  name="window-half-size"
                  onChange={(e) => setWindowHalfSize(Number(e.target.value))}
                  defaultValue={windowHalfSize}
                  type="text"
                  className={`w-full px-2 py-2 h-10 border placeholder-danube-900 rounded-lg ${
                    isNaN(windowHalfSizeVal) ? "border-red-custom" : "border-danube-200"
                  }`}
                  placeholder="Window half size"
                />
                <label className="text-danube-600 text-[10px] relative -top-1  left-1" htmlFor={"threshold"}>
                  Window half size
                </label>
              </div>
              <div className="mb-5">
                <input
                  name={"threshold"}
                  defaultValue={threshold}
                  onChange={(e) => {
                    setThreshold(Number(e.target.value));
                  }}
                  type="text"
                  className={`w-full  px-2 py-2 h-10 border placeholder-danube-900 rounded-lg ${
                    isNaN(thresholdVal) ? "border-red-custom" : "border-danube-200"
                  }`}
                  placeholder="threshold"
                />
                <label className="text-danube-600  text-[10px] relative -top-1 left-1" htmlFor={"threshold"}>
                  threshold
                </label>
              </div>
              <Button text="Apply" onClick={onApplyClick} disabled={isNaN(thresholdVal) || isNaN(windowHalfSizeVal)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CastChartSetter;
