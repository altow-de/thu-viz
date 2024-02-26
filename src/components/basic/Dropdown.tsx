import React from "react";
import "../../../styles/dropdown.css";
import { Option } from "@/frontend/types";

interface DropwDownProps {
  disabled?: boolean;
  options: Option[];
  option_keys: string[];
  setSelection: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DropwDown: React.FC<DropwDownProps> = ({
  options,
  option_keys,
  setSelection,
  disabled,
}) => {
  return (
    <select
      className="mb-4 minimal text-danube-900 border-danube-400 border py-2 px-4 w-full rounded-lg font-light text-sm placeholder-gray-custom bg-white disabled:opacity-40 disabled:cursor-not-allowed outline-danube-600 appearance-none"
      defaultValue={-1}
      onChange={(e) => setSelection(e)}
      disabled={disabled}
    >
      <option className="text-danube-900" key={-1} value={-1}>
        All
      </option>
      {options?.map((option: any, index: number) => (
        <option
          className="text-danube-900"
          key={index}
          value={Object(option)[option_keys[0]]}
        >
          {option_keys.map((option_key) => {
            const val = Object(option)[option_key] + "\u00A0";
            return val;
          })}
        </option>
      ))}
    </select>
  );
};

export default DropwDown;
