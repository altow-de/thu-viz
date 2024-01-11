interface HeadlineProps {
  text: string;
}

const Headline = ({ text }: HeadlineProps) => {
  return <div className="text-sm text-danube-900">{text}</div>;
};

export default Headline;
