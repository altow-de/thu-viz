import { MapStyles } from "@/frontend/constants";
import { MapStyleProps } from "../map/MapStyle";

interface RadioButtonProps {
  mapStyleKey: string;
}

/**
 * A reusable radio button component for selecting map styles.
 * @param {RadioButtonProps & MapStyleProps} props - The props for the radio button component.
 * @returns {JSX.Element} - The rendered radio button component.
 */
const RadioButton = ({
  mapStyleKey,
  selectedStyle,
  setSelectedStyle,
}: RadioButtonProps & MapStyleProps): JSX.Element => {
  return (
    <div className="inline-flex items-center" onClick={() => setSelectedStyle(mapStyleKey)}>
      <label className="relative flex items-center p-1 rounded-full cursor-pointer" htmlFor={"radio-" + mapStyleKey}>
        <input
          type="radio"
          className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-blue-danube-200 text-danube-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-danube-500 before:opacity-0 before:transition-opacity checked:border-danube-900 checked:before:bg-danube-900 hover:before:opacity-10 before:w-auto before:h-auto"
          id={"radio-" + mapStyleKey}
          checked={selectedStyle === mapStyleKey}
          value={mapStyleKey}
          readOnly
        />
        <span className="absolute text-danube-900 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="currentColor">
            <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
          </svg>
        </span>
      </label>
      <label className="mt-px text-danube-700 cursor-pointer select-none" htmlFor={"radio-" + mapStyleKey}>
        {MapStyles[mapStyleKey]}
      </label>
    </div>
  );
};

export default RadioButton;
