import React from "react";
import "../../../styles/dropdown.css";
import { Option } from "@/frontend/types";

interface DropwDownProps {
  disabled?: boolean;
  options: Option[];
  option_keys: string[];
  setSelection: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: number;
  emptyDefaultRow?: boolean;
}

/**
 * A reusable dropdown component.
 * @param {DropwDownProps} props - The props for the dropdown component.
 * @returns {JSX.Element} - The rendered dropdown component.
 */
const DropwDown: React.FC<DropwDownProps> = ({
  options,
  option_keys,
  setSelection,
  disabled,
  defaultValue,
  emptyDefaultRow,
}) => {
  /**
   * Creates a value string from the specified option keys and option object.
   * @param {string[]} option_keys - The keys to use for creating the value string.
   * @param {Option} option - The option object.
   * @returns {string} - The concatenated value string.
   */
  const createValue = (option_keys: string[], option: Option): string => {
    return option_keys
      .map((option_key) => {
        const val = Object(option)[option_key] + "\u00A0";
        return val;
      })
      .join("");
  };

  const defaultIndex = options?.findIndex((opt: any) => opt[option_keys[0]] === defaultValue);

  return (
    <select
      className="mb-4 minimal text-danube-900 border-danube-400 border py-2 px-4 w-full rounded-lg font-light text-sm placeholder-gray-custom bg-white disabled:opacity-40 disabled:cursor-not-allowed outline-danube-600 appearance-none"
      defaultValue={defaultIndex > -1 ? defaultIndex : -1}
      onChange={(e) => setSelection(e)}
      disabled={disabled}
    >
      <option className="text-danube-900" key={-1} value={-1}>
        {!emptyDefaultRow && !disabled ? "All" : ""}
      </option>
      {options &&
        options.length > 0 &&
        options.map((option: Option, index: number) => {
          return (
            <option
              className="text-danube-900"
              key={index}
              value={isNaN(Number(option_keys[0])) ? index : Number(Object(option)[option_keys[0]])}
            >
              {createValue(option_keys, option)}
            </option>
          );
        })}
    </select>
  );
};

export default DropwDown;
