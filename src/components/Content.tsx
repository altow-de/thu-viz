interface ContentProps {
  children?: any;
  title: string;
}

const Content = ({ children, title }: ContentProps) => {
  return (
    <div className="flex p-4 sm:p-8 bg-danube-100 rounded-b-md">
      <div>{title}</div>
      <div>{children}</div>
    </div>
  );
};
export default Content;
