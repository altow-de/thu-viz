import React from "react";
import "../../../styles/dropdown.css";
import { Option } from "@/frontend/types";

interface DropwDownProps {
  options: Option[];
  option_key: string;
}

const DropwDown: React.FC<DropwDownProps> = ({ options, option_key }) => {
  return (
    <select
      className="mb-4 minimal text-danube-900 border-danube-400 border py-2.5 px-4 w-full rounded-lg font-light text-sm placeholder-gray-custom bg-white disabled:opacity-40 disabled:cursor-not-allowed outline-danube-600 appearance-none"
      defaultValue={-1}
    >
      <option className="text-danube-900" key={-1} value={-1}>
        All
      </option>
      {options.map((option: any, index: number) => (
        <option className="text-danube-900" key={index} value={option}>
          {Object(option)[option_key]}
        </option>
      ))}
    </select>
  );
};

export default DropwDown;
