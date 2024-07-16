import Switch from "../table/Switch";
import { useEffect, useState } from "react";
import Checkbox from "../basic/Checkbox";
import Button from "../basic/Button";
import "../../../styles/colorindicators.css";
import CastDetectionLegend from "./CastDetectionLegend";
import { LegendKey } from "@/frontend/enum";
import { DefaultThreshold, DefaultWindowHalfSite } from "@/frontend/constants";
import { useStore } from "@/frontend/store";
import { observer } from "mobx-react-lite";

interface CastChartSetterProps {
  setAppliedData: (threshold: number, windowHalfSize: number) => void;
  threshold: number;
  windowHalfSize: number;
  handleChanges: (checkboxes: { [key: string]: boolean }, activeSwitch: boolean) => void;
}

/**
 * A component to set the parameters for the cast chart.
 * @param {Object} props - The props for the CastChartSetter component.
 * @param {Function} props.setAppliedData - Function to apply the sensitivity values.
 * @param {number} props.threshold - The threshold value for sensitivity settings.
 * @param {number} props.windowHalfSize - The window half size value for sensitivity settings.
 * @param {Function} props.handleChanges - Function to handle changes in the checkboxes and switch state.
 * @returns {JSX.Element} - The rendered CastChartSetter component.
 */
const CastChartSetter = ({
  setAppliedData,
  windowHalfSize,
  threshold,
  handleChanges,
}: CastChartSetterProps): JSX.Element => {
  const { data: dataStore } = useStore();
  const defaultCheckbox = { checkbox1: true, checkbox2: true, checkbox3: true };
  const [windowHalfSizeVal, setWindowHalfSize] = useState<number>(windowHalfSize);
  const [thresholdVal, setThreshold] = useState<number>(threshold);
  const [switchState, setSwitchState] = useState<boolean>(false);
  const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>(defaultCheckbox);
  const [sensitivityVisible, setSensitivityVisible] = useState<boolean>(false);

  /**
   * Resets the CastChartSetter component to its default state.
   */
  const resetCastChartSetter = () => {
    setThreshold(DefaultThreshold);
    setWindowHalfSize(DefaultWindowHalfSite);
    setCheckboxes(defaultCheckbox);
    handleChanges(defaultCheckbox, false);
    setSwitchState(false);
  };

  /**
   * Handles changes to the checkboxes.
   * @param {string} checkboxName - The name of the checkbox.
   * @param {boolean} isChecked - The checked state of the checkbox.
   */
  const handleCheckboxChange = (checkboxName: string, isChecked: boolean) => {
    const newCheckboxes = { ...checkboxes, [checkboxName]: isChecked };
    setCheckboxes(newCheckboxes);
    handleChanges(newCheckboxes, switchState);
  };

  /**
   * Applies the sensitivity values.
   */
  const onApplyClick = () => {
    setAppliedData(thresholdVal, windowHalfSizeVal);
  };

  useEffect(() => {
    if (switchState) setCheckboxes(defaultCheckbox);
    handleChanges(defaultCheckbox, switchState);
  }, [switchState]);

  useEffect(() => {
    resetCastChartSetter();
  }, [dataStore.switchReset]);

  return (
    <div className="flex justify-center w-[300px]">
      <div className="inline-block flex-none w-full h-full divide-y divide-danube-200 text-sm text-danube-900 px-3">
        <div className="flex flex-row my-2 items-center flex-auto">
          <Switch type={"cast"} onSwitch={setSwitchState} selected={switchState} style={""} />
          <div className="px-2 h-full w-full">Automatic Cast Detection</div>
          <div className="w-5 h-4">
            <CastDetectionLegend textKey={LegendKey.CastDetecion} />
          </div>
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
            label={"Rest"}
          />
          <Checkbox
            id="checkbox3"
            handleCheckboxChange={handleCheckboxChange}
            checkbox={checkboxes.checkbox3}
            activeSwitch={switchState}
            label={"Upcast"}
          />
        </div>

        {switchState && (
          <div
            className={`py-4 ${!sensitivityVisible ? "underline underline-offset-[5px] decoration-danube-200" : ""}`}
          >
            <div
              className="font-semibold pt-2 relative cursor-pointer flex flex-row"
              onClick={() => setSensitivityVisible(!sensitivityVisible)}
            >
              Change sensitivity
              <div className="ml-2">
                <CastDetectionLegend textKey={LegendKey.Sensitivity} />
              </div>
              {sensitivityVisible && (
                <div className="w-0 h-0 border-l-[5px] border-l-transparent  border-b-[6px] border-r-[5px] border-r-transparent right-0 bottom-[13px] mb-[3px] absolute top-3.5 bottom-0 border-b-danube-800"></div>
              )}
              {!sensitivityVisible && (
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-t-[6px] border-r-[5px] border-r-transparent right-0 bottom-[2px] mt-[2px] absolute top-3.5 border-t-danube-800"></div>
              )}
            </div>
            {sensitivityVisible && (
              <div>
                <div className="mt-2">
                  <input
                    name="window-half-size"
                    onChange={(e) => setWindowHalfSize(Number(e.target.value))}
                    defaultValue={windowHalfSize}
                    type="text"
                    className={`w-full px-2 py-2 h-10 border placeholder-danube-900 rounded-lg ${
                      isNaN(windowHalfSizeVal) ? "border-red-custom" : "border-danube-200"
                    }`}
                    placeholder="Window half size [number of measurements]"
                  />
                  <label className="text-danube-600 text-[10px] relative -top-1 left-1" htmlFor="window-half-size">
                    Window half size [number of measurements]
                  </label>
                </div>
                <div className="mb-5">
                  <input
                    name="threshold"
                    defaultValue={threshold}
                    onChange={(e) => {
                      setThreshold(Number(e.target.value));
                    }}
                    type="text"
                    className={`w-full px-2 py-2 h-10 border placeholder-danube-900 rounded-lg ${
                      isNaN(thresholdVal) ? "border-red-custom" : "border-danube-200"
                    }`}
                    placeholder="Threshold [m/s]"
                  />
                  <label className="text-danube-600 text-[10px] relative -top-1 left-1" htmlFor="threshold">
                    Threshold [m/s]
                  </label>
                </div>
                <Button
                  text="Apply"
                  onClick={onApplyClick}
                  disabled={isNaN(thresholdVal) || isNaN(windowHalfSizeVal)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(CastChartSetter);
