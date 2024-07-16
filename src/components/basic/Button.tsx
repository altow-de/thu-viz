import { MouseEventHandler } from "react";

interface ButtonProps {
  text: string;
  onClick: MouseEventHandler;
  disabled?: boolean;
}

/**
 * A reusable button component.
 * @param {ButtonProps} props - The props for the button component.
 * @returns {JSX.Element} - The rendered button component.
 */
const Button = ({ text, onClick, disabled }: ButtonProps): JSX.Element => {
  return (
    <button
      className={`bg-danube-600 text-sm font-semibold text-white py-2 px-6 rounded-full ${
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-danube-500 cursor-pointer"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
