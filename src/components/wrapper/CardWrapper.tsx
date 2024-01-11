interface CardWrapperTypes {
  children: React.ReactNode;
  text: string;
  hasMap: boolean;
}

const CardWrapper = ({ children, text, hasMap }: CardWrapperTypes) => {
  return (
    <div className={`flex-col flex-1 bg-danube-500 rounded-lg shadow-md mb-8 ${!hasMap ? "z-40" : ""}`}>
      <div className="text-white  text-sm py-3 px-4">{text}</div>
      <div className={`flex-1 w-auto bg-white rounded-lg ${hasMap ? "overflow-hidden " : "p-4"}`}>{children}</div>
    </div>
  );
};

export default CardWrapper;
