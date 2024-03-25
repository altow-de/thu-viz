interface ChartWrapperProps {
  children: React.ReactNode;
  dataLoading: boolean;
  width: number;
}

const ChartWrapper = ({ children, dataLoading, width }: ChartWrapperProps) => {
  return (
    <div className=" flex justify-center ">
      {dataLoading ? <img className="z-0" src="pulse_load.svg" width={width} height={300} /> : children}
    </div>
  );
};

export default ChartWrapper;
