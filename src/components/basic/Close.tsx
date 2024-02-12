import { style } from "d3-selection";
import { MouseEventHandler } from "react";

interface CloseProps {
  onClick: MouseEventHandler;
  style?: string;
  strokeHover?: boolean;
}

const Close = ({ onClick, style, strokeHover }: CloseProps) => {
  return (
    <div className={`${style}`} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-6 h-6 inline-block stroke-[3px]  ${strokeHover ? "hover:stroke-[4px]" : ""}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
};

export default Close;
