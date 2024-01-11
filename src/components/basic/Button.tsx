interface ButtonProps {
  text: string;
}

const Button = ({ text }: ButtonProps) => {
  return <button className="bg-danube-600 hover:bg-danube-500 text-white py-2 px-4 rounded-full">{text}</button>;
};
export default Button;
