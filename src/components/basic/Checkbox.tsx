import React from "react";

interface CheckboxProps {
  activeSwitch: boolean;
  label: string;
  id: string;
  checkbox: boolean;
  handleCheckboxChange: (checkboxName: string, isChecked: boolean) => void;
}

/**
 * A reusable checkbox component.
 * @param {CheckboxProps} props - The props for the checkbox component.
 * @returns {JSX.Element} - The rendered checkbox component.
 */
const Checkbox = ({ activeSwitch, label, checkbox, handleCheckboxChange, id }: CheckboxProps): JSX.Element => {
  /**
   * Handles the change event for the checkbox.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked: boolean = event.target.checked;
    handleCheckboxChange(id, isChecked);
  };

  return (
    <div className="flex group items-center my-2">
      <input
        id={"link-checkbox" + label}
        type="checkbox"
        value=""
        className={`w-4 h-4 ${
          !activeSwitch
            ? ""
            : `form-checkbox text-danube-600  border-danube-200 rounded focus:ring-danube-500 dark:focus:ring-danube-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`
        }`}
        disabled={!activeSwitch}
        checked={!activeSwitch ? true : checkbox}
        onChange={handleChange}
      />
      <label
        htmlFor={"link-checkbox" + label}
        className={`ms-2 text-sm text-danube-900 dark:text-gray-300  ${
          !activeSwitch ? "" : "group-hover:text-danube-700 dark:group-hover:text-danube-300 cursor-pointer"
        }  transition-colors duration-200`}
      >
        {label}
      </label>
      <div id={"color-dot-" + label}></div>
    </div>
  );
};

export default Checkbox;
