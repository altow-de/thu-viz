interface HeadlineProps {
  text: string;
}

/**
 * A reusable headline component.
 * @param {HeadlineProps} props - The props for the headline component.
 * @returns {JSX.Element} - The rendered headline component.
 */
const Headline = ({ text }: HeadlineProps): JSX.Element => {
  return <div className="text-sm text-danube-900 my-1">{text}</div>;
};

export default Headline;
