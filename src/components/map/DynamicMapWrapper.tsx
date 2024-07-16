import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { OceanMapProps } from "./Map";

// Dynamically import the OceanMap component, disabling server-side rendering.
const OceanMap = dynamic(() => import("./Map"), {
  ssr: false, // Disable server-side rendering if needed.
});

/**
 * DynamicMapWrapper component that wraps the OceanMap component, allowing it to be dynamically imported and forwarded a ref.
 * @param {OceanMapProps} props - The props for the OceanMap component.
 * @param {React.Ref<HTMLDivElement>} ref - The forwarded ref to the OceanMap component.
 * @returns {JSX.Element} - The rendered DynamicMapWrapper component.
 */
const DynamicMapWrapper = forwardRef<HTMLDivElement, OceanMapProps>(({ ...props }: OceanMapProps, ref) => {
  return <OceanMap {...props} forwardedRef={ref} />;
});

export default DynamicMapWrapper;
