interface ContentProps {
  children: React.ReactNode;
  title: string;
}

const Content = ({ children, title }: ContentProps) => {
  return (
    <div className="flex p-4 sm:p-8 bg-danube-100 rounded-b-lg flex-col">
      <div className="mb-7 font-bold text-lg">{title}</div>
      <div>{children}</div>
    </div>
  );
};
export default Content;
