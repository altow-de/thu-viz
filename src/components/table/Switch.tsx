import { useState } from "react";

interface SwitchProps {
  style: string;
}

const Switch = ({ style }: SwitchProps) => {
  const [trigger, setTrigger] = useState<boolean>(false);

  const onTrigger = () => {
    setTrigger(!trigger);
  };
  return (
    <div className={`flex flex-col flex-1 items-center py-4 px-2  ${style}`}>
      <div className="relative" onClick={onTrigger}>
        <div
          className={`relative w-5 h-[0.5rem] drop-shadow-md rounded cursor-pointer duration-300 ${
            trigger ? "bg-danube-700" : "bg-danube-50"
          }`}
        >
          <div
            className={`absolute w-3 h-3  -top-1 -left-1 cursor-pointer rounded-full drop-shadow-md duration-300 ${
              trigger ? "translate-x-4 translate-y-[0.13rem] bg-danube-800" : "translate-y-[0.13rem] bg-white"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Switch;
