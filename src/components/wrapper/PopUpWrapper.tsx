import { MouseEventHandler } from "react";
import Close from "../basic/Close";

/**
 * PopUpWrapper component.
 *
 * This component provides a modal-like popup overlay with a title and close button.
 *
 * @param {PopUpWrapperProps} props - The properties for the PopUpWrapper component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the popup.
 * @param {string} props.title - The title of the popup.
 * @param {MouseEventHandler} props.onClick - The function to call when the close button is clicked.
 * @returns {JSX.Element} The rendered PopUpWrapper component.
 */
interface PopUpWrapperProps {
  children: React.ReactNode;
  title: string;
  onClick: MouseEventHandler;
}

const PopUpWrapper = ({ children, title, onClick }: PopUpWrapperProps): JSX.Element => {
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
