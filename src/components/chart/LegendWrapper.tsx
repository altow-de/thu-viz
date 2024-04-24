import React, { useState } from "react";

interface LegendWrapperProps {
  children: React.ReactNode;
  isHover?: boolean;
}

const LegendWrapper = ({ children, isHover }: LegendWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="group">
      {!isOpen && (
        <img
          className="w-4 h-4 cursor-pointer"
          onClick={!isHover ? handleOnClick : () => {}}
          src="info.svg"
          alt="Info icon"
        />
      )}
      {isOpen && !isHover && (
        <div
          id="zoom-legend"
          onClick={handleOnClick}
          className="flex flex-col w-fit p-1 mb-5 border-2 rounded-md border-danube-500 text-xs text-danube-900 cursor-pointer"
        >
          {children}
        </div>
      )}
      {isHover && (
        <div
          id="zoom-legend"
          className="hidden absolute flex flex-col w-64 p-2 rounded-md border-danube-500 bg-danube-200 text-xs text-danube-900 cursor-pointer group-hover:block"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default LegendWrapper;
