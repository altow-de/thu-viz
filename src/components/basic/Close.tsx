import { MouseEventHandler } from "react";

interface CloseProps {
  onClick: MouseEventHandler;
}

const Close = ({ onClick }: CloseProps) => {
  return (
    <div className=" w-1/3 relative left-full -translate-x-[15%] -translate-y-1/2 cursor-pointer" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 inline-block stroke-[3px] hover:stroke-[4px]"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
};

export default Close;
