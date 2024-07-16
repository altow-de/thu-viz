import MeasurementData from "./MeasurementData";
import Overview from "./Overview";

/**
 * PageContent component.
 *
 * This component renders the content of the page based on the provided page index.
 *
 * @param {PageContentProps} props - The properties for the PageContent component.
 * @param {number} props.pageIndex - The index of the page to be rendered.
 * @returns {JSX.Element} The rendered content for the specified page.
 */
interface PageContentProps {
  pageIndex: number;
}

const PageContent = ({ pageIndex }: PageContentProps): JSX.Element => {
  switch (pageIndex) {
    case 1:
      return <MeasurementData />;
    default:
      return <Overview />;
  }
};

export default PageContent;
