import { useState } from "react";

interface CheckboxProps {
  activeSwitch: boolean;
  label: string;
  id: string;
  isChecked: any;
  handleChecked: any;
}

const Checkbox = ({
  activeSwitch,
  label,
  isChecked,
  handleChecked,
}: CheckboxProps) => {
  const handleCheckboxChange = () => {
    // handleChecked(!isChecked);
  };

  return (
    <div className="flex items-center">
      <input
        id={"link-checkbox" + label}
        type="checkbox"
        value=""
        className="w-4 h-4 text-danube-600 bg-gray-100 border-gray-300 rounded focus:ring-danube-500 dark:focus:ring-danube-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        disabled={activeSwitch}
        checked={activeSwitch ? true : isChecked}
        onChange={handleCheckboxChange}
      />
      <label
        htmlFor={"link-checkbox" + label}
        className="ms-2 text-sm font-medium text-danube-900 dark:text-gray-300"
      >
        {label}
      </label>
    </div>
  );
};
export default Checkbox;
