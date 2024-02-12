import { MouseEventHandler } from "react";
import Close from "../basic/Close";

interface PopUpWrapperProps {
  children: React.ReactNode;
  title: string;
  onClick: MouseEventHandler;
}

const PopUpWrapper = ({ children, title, onClick }: PopUpWrapperProps) => {
  return (
    <div className="relative">
      <div className="fixed bg-black w-screen top-0 h-screen right-0 z-40 opacity-40" />
      <div className="fixed flex flex-col bg-white max-w-[1000px] max-h-[600px] -translate-x-1/2 left-1/2  h-auto top-16 px-6 rounded-lg z-40 w-full">
        <div className="relative left-1/2 text-center top-6 -translate-x-1/2 bg-white font-bold text-2xl text-danube-800 inline-block">
          {title}
        </div>
        <Close
          onClick={onClick}
          style="w-1/3 relative left-full -translate-x-[15%] -translate-y-1/2 cursor-pointer"
          strokeHover={true}
        />
        <div className="relative w-full my-6">{children}</div>
      </div>
    </div>
  );
};
export default PopUpWrapper;
