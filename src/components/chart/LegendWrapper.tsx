import React, { useState } from "react";

interface LegendWrapperProps {
  children: React.ReactNode;
  isHover?: boolean;
}

/**
 * LegendWrapper component that displays a legend or additional information.
 * @param {Object} props - The props for the LegendWrapper component.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the LegendWrapper.
 * @param {boolean} [props.isHover] - Flag to indicate if the legend should be shown on hover.
 * @returns {JSX.Element} - The rendered LegendWrapper component.
 */
const LegendWrapper = ({ children, isHover }: LegendWrapperProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggles the visibility of the legend when clicked.
   */
  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="group relative">
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
          className="hidden absolute flex flex-col w-64 p-2 rounded-md border-danube-500 bg-danube-200 text-xs text-danube-900 cursor-pointer group-hover:block right-2 top-8"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default LegendWrapper;
