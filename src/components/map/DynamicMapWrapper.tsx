import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { OceanMapProps } from "./Map";
const OceanMap = dynamic(() => import("./Map"), {
  ssr: false, // Optional, je nach Bedarf
});

const DynamicMapWrapper = forwardRef<HTMLDivElement, OceanMapProps>(({ ...props }: OceanMapProps, ref) => {
  return <OceanMap {...props} forwardedRef={ref} />;
});

export default DynamicMapWrapper;
