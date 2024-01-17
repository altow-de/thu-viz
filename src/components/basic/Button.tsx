import { MouseEventHandler } from "react";

interface ButtonProps {
  text: string;
  onClick: MouseEventHandler;
}

const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      className="bg-danube-600 hover:bg-danube-500 text-sm font-semibold text-white py-2 px-6 rounded-full"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
export default Button;
