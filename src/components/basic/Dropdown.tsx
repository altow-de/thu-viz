import React from "react";
import "../../../styles/dropdown.css";

interface DropwDownProps {
  options: string[];
}

const DropwDown: React.FC<DropwDownProps> = ({ options }) => {
  return (
    <select className="mb-4 minimal text-danube-900 border-danube-400 border py-2.5 px-4 w-full rounded-lg font-light text-sm placeholder-gray-custom bg-white disabled:opacity-40 disabled:cursor-not-allowed outline-danube-600 appearance-none">
      {options.map((option, index) => (
        <option className="text-danube-900" key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default DropwDown;
