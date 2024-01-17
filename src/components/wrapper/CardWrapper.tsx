import { useEffect, useState } from "react";

interface CardWrapperTypes {
  children: React.ReactNode;
  text: string;
  hasMap: boolean;
  id: string;
}

const CardWrapper = ({ children, text, hasMap, id }: CardWrapperTypes) => {
  const [hinged, setHinged] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);
  const handleResize = () => {
    const width = window.innerWidth;
    setHinged(width < 768);
    setVisible(true);
  };
  useEffect(() => {
    //initial after rendering
    handleResize();
    // add event listener for resize event
    window.addEventListener("resize", handleResize);
    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className={`flex-1 flex-col bg-danube-500 rounded-lg shadow-md mb-8 w-full  ${!hasMap ? "z-30" : ""} ${
        hinged ? "cursor-pointer " : ""
      }`}
      id={id}
    >
      <div
        className="text-white text-sm py-3 px-4  w-full flex relative"
        onClick={() => setVisible(hinged ? !visible : true)}
      >
        {text}
        {hinged && !visible && (
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-t-[6px] border-r-[5px] border-r-transparent right-0 bottom-[2px] mt-[2px] absolute right-4 top-[18px]"></div>
        )}
        {hinged && visible && (
          <div className=" w-0 h-0 border-l-[5px] border-l-transparent border-b-[6px] border-r-[5px] border-r-transparent right-0 bottom-[13px] mb-[3px]  absolute right-4 bottom-4"></div>
        )}
      </div>

      {visible && (
        <div className={`flex-1 w-auto bg-white rounded-lg  flex flex-col ${hasMap ? "overflow-y-hidden " : "p-4"}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CardWrapper;
