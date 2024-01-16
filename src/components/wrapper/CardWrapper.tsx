interface CardWrapperTypes {
  children: React.ReactNode;
  text: string;
  hasMap: boolean;
}

const CardWrapper = ({ children, text, hasMap }: CardWrapperTypes) => {
  return (
    <div className={`flex-1 flex-col bg-danube-500 rounded-lg shadow-md mb-8 w-full  ${!hasMap ? "z-40" : ""}`}>
      <div className="text-white  text-sm py-3 px-4">{text}</div>
      <div
        className={`flex-1 w-auto bg-white rounded-lg overflow-x-auto flex flex-col ${
          hasMap ? "overflow-y-hidden " : "p-4"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default CardWrapper;
