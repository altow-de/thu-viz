interface ContentProps {
  children: React.ReactNode;
  title: string;
}

const Content = ({ children, title }: ContentProps) => {
  return (
    <div className="flex p-4 sm:p-8 bg-danube-100 rounded-b-lg flex-col">
      <div className="mb-7 font-bold text-lg">{title}</div>
      <div>{children}</div>
      <div className="bg-white p-2 text-center text-danube-900 rounded mt-2 text-sm">
        For more information and data export please visit{" "}
        <a href="https://www.hyfive.info" target="_blank" className="underline">
          hyfive.info
        </a>{" "}
        or contact{" "}
        <a href="mailto:info@hyfive.info" className="underline">
          info@hyfive.info
        </a>
      </div>
    </div>
  );
};
export default Content;
