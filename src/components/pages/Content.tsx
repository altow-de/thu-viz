interface ContentProps {
  children: React.ReactNode;
  title: string;
}

/**
 * Content component.
 *
 * This component is used to display a content section with a title, children elements, and additional information at the bottom.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be displayed within the component.
 * @param {string} props.title - The title to be displayed at the top of the content section.
 * @returns {JSX.Element} The Content component.
 */
const Content = ({ children, title }: ContentProps): JSX.Element => {
  return (
    <div className="flex p-4 sm:p-8 bg-danube-100 rounded-b-lg flex-col">
      <div className="mb-7 font-bold text-lg">{title}</div>
      <div>{children}</div>
      <div className="bg-white p-2 text-center text-danube-900 rounded mt-2 text-sm">
        For more information and data export please visit{" "}
        <a href="https://www.hyfive.info" target="_blank" rel="noopener noreferrer" className="underline">
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
