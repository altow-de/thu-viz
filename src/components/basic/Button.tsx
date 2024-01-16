interface ButtonProps {
  text: string;
}

const Button = ({ text }: ButtonProps) => {
  return (
    <button className="bg-danube-600 hover:bg-danube-500 text-sm font-semibold text-white py-2 px-6 rounded-full">
      {text}
    </button>
  );
};
export default Button;
