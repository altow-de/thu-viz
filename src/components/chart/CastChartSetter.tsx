import { ParameterDataForDeployment } from "@/backend/services/ProcessedValueService";
import Switch from "../table/Switch";
import { useEffect, useState } from "react";
import Checkbox from "../basic/Checkbox";
import Button from "../basic/Button";

interface CastChartSetterProps {
  setAppliedData: any;
}

const CastChartSetter = ({ setAppliedData }: CastChartSetterProps) => {
  const [switchState, setSwitchState] = useState<boolean>(false);
  const [checkboxes, setCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  console.log(checkboxes);
  const onApplyClick = () => {
    setAppliedData(checkboxes, switchState);
  };

  return (
    <div className="flex flex-col min-w-[250px] h-full divide-y divide-danube-200 text-sm text-danube-900">
      <div className="py-4">
        <Switch
          style={"inline-block"}
          type={"cast"}
          onSwitch={setSwitchState}
        />
        <label className="px-2">Automatic Cast Detection</label>
        <br />
      </div>

      <div className="py-4">
        <p className="font-semibold py-2">Parts of Deployment</p>
        <Checkbox
          id="CheckboxDowncast"
          handleChecked={setCheckboxes}
          isChecked={checkboxes.checkbox1}
          activeSwitch={switchState}
          label={"Downcast"}
        />
        <Checkbox
          id="CheckboxBottomU"
          handleChecked={setCheckboxes}
          isChecked={checkboxes.checkbox2}
          activeSwitch={switchState}
          label={"BottomU"}
        />
        <Checkbox
          id="CheckboxUpcast"
          handleChecked={setCheckboxes}
          isChecked={checkboxes.checkbox3}
          activeSwitch={switchState}
          label={"Upcast"}
        />
      </div>
      <div className="py-4">
        <Button text="Apply" onClick={onApplyClick} />
      </div>
    </div>
  );
};

export default CastChartSetter;
