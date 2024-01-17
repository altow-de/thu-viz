interface CardWrapperTypes {
  children: React.ReactNode;
  text: string;
  hasMap: boolean;
  id: string;
}

const CardWrapper = ({ children, text, hasMap, id }: CardWrapperTypes) => {
  return (
    <div className={`flex-1 flex-col bg-danube-500 rounded-lg shadow-md mb-8 w-full  ${!hasMap ? "z-40" : ""}`} id={id}>
      <div className="text-white  text-sm py-3 px-4">{text}</div>
      <div className={`flex-1 w-auto bg-white rounded-lg  flex flex-col ${hasMap ? "overflow-y-hidden " : "p-4"}`}>
        {children}
      </div>
    </div>
  );
};

export default CardWrapper;
