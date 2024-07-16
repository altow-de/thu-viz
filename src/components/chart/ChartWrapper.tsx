interface ChartWrapperProps {
  children: React.ReactNode;
  dataLoading: boolean;
  width: number;
}
/**
 * ChartWrapper component that wraps the chart components and displays a loading indicator when data is being loaded.
 * @param {Object} props - The props for the ChartWrapper component.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the ChartWrapper.
 * @param {boolean} props.dataLoading - Flag to indicate if the data is currently loading.
 * @param {number} props.width - The width of the chart.
 * @returns {JSX.Element} - The rendered ChartWrapper component.
 */
const ChartWrapper = ({ children, dataLoading, width }: ChartWrapperProps) => {
  return (
    <div className=" flex justify-center ">
      {dataLoading ? <img className="z-0" src="pulse_load.svg" width={width} height={300} /> : children}
    </div>
  );
};

export default ChartWrapper;
