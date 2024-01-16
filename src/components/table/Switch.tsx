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
          className={`relative w-8 h-4 drop-shadow-md rounded-full cursor-pointer duration-300 ring-1 ${
            trigger ? " bg-danube-600 ring-danube-600" : " bg-gray-custom ring-gray-custom "
          }`}
        >
          <div
            className={`absolute w-4 h-4 -top-0.5 left-0 cursor-pointer rounded-full drop-shadow-md duration-300 ${
              trigger
                ? "translate-x-4 translate-y-[0.13rem] bg-white"
                : "ring-1 translate-y-[0.13rem] bg-white ring-gray-custom"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Switch;
