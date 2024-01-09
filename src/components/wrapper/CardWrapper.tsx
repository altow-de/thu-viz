interface CardWraperTypes {
  children: React.ReactNode;
  text: string;
  hasMap: boolean;
}

const CardWraper = ({ children, text, hasMap }: CardWraperTypes) => {
  return (
    <div className="flex-col flex-1 bg-danube-500 rounded-lg shadow-md mb-8">
      <div className="text-white  text-sm py-3 px-4">{text}</div>
      <div className={`flex-1 overflow-hidden w-auto bg-white rounded-lg ${hasMap ? "" : "p-4"}`}>{children}</div>
    </div>
  );
};

export default CardWraper;
