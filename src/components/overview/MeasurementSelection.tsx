import React, { useCallback, useEffect, useState } from "react";
import { DateValueType } from "react-tailwindcss-datepicker";
import "../../../styles/dropdown.css";
import Button from "../basic/Button";
import DatePicker from "../basic/DatePicker";
import DropwDown from "../basic/Dropdown";
import Headline from "../basic/Headline";
import CardWrapper from "../wrapper/CardWrapper";
import { PlatformsCombinedWithVessels } from "@/backend/services/PlatformService";
import { PlatformService } from "@/frontend/services/PlatformService";
import { Region } from "@/frontend/types";
import { OverviewAnchors } from "@/frontend/enum";
import { useStore } from "@/frontend/store";
import { regions } from "@/frontend/regions";

interface MeasurementSelectionProps {
  setStartDate: (time_start: Date | undefined) => void;
  setEndDate: (time_end: Date | undefined) => void;
  setRegion: (region: Region) => void;
  setPlatform: (platform_id: number) => void;
  setApplyClicked: (clicked: boolean) => void;
  applyClicked: boolean;
}

/**
 * MeasurementSelection component.
 *
 * This component allows the user to select measurement data based on time range, vessel, and region.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setStartDate - Function to set the start date.
 * @param {Function} props.setEndDate - Function to set the end date.
 * @param {Function} props.setRegion - Function to set the selected region.
 * @param {Function} props.setPlatform - Function to set the selected platform.
 * @param {Function} props.setApplyClicked - Function to handle the apply button click state.
 * @param {boolean} props.applyClicked - State to track if apply button was clicked.
 * @returns {JSX.Element} The MeasurementSelection component.
 */
const MeasurementSelection: React.FC<MeasurementSelectionProps> = ({
  setEndDate,
  setStartDate,
  setRegion,
  setPlatform,
  setApplyClicked,
  applyClicked,
}) => {
  const { data: dataStore } = useStore();
  const platformService: PlatformService = new PlatformService(dataStore);
  const [platforms, setPlatforms] = useState<PlatformsCombinedWithVessels[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<number>(-1);
  const [selectedRegion, setSelectedRegion] = useState<number>(-1);
  const [resetTriggered, setResetTriggered] = useState<boolean>(false);

  /**
   * Handles the selection of a region.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const selectRegion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(e.target.value);
    setSelectedRegion(selected);
  };

  /**
   * Handles the selection of a platform.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const selectPlatform = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(e.target.value);
    setSelectedPlatform(selected);
  };

  /**
   * Fetches the platforms combined with vessels.
   */
  const getPlatforms = useCallback(async () => {
    const data = await platformService.getPlatformsCombinedWithVessels();
    setPlatforms(data);
  }, []);

  useEffect(() => {
    getPlatforms();
  }, [getPlatforms]);

  const startDate: Date = new Date("2022-01-01");
  const [dateFrom, setDateFrom] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [dateTo, setDateTo] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  /**
   * Handles the apply button click event.
   */
  const onApplyClicked = () => {
    if (dateFrom?.startDate) {
      const date = new Date(dateFrom?.startDate);
      date.setHours(0, 0, 0, 0);
      setStartDate(date);
    } else {
      setStartDate(undefined);
    }
    if (dateTo?.endDate) {
      const date = new Date(dateTo?.endDate);
      date.setHours(23, 59, 59, 999);
      setEndDate(date);
    } else {
      setEndDate(undefined);
    }
    setPlatform(Number(platforms[selectedPlatform]?.platform_id));
    setRegion(regions[selectedRegion]);
    setApplyClicked(!applyClicked);
  };

  return (
    <div className="basis-full md:basis-1/3">
      <CardWrapper text={"Selection of measurement data"} hasMap={false} id={OverviewAnchors.MeasurementSelection}>
        <Headline text={"Choose time range"} />
        <div className="flex flex-col md:flex-row gap-1 z-30">
          <DatePicker
            placeholder={"Date from"}
            startDate={startDate}
            selectedDate={dateFrom}
            setSelectedDate={setDateFrom}
            setResetTriggered={setResetTriggered}
          />
          <DatePicker
            placeholder={"Date to"}
            startDate={dateFrom?.endDate ? new Date(dateFrom?.endDate?.toString()) : null}
            selectedDate={dateTo}
            setSelectedDate={setDateTo}
            setResetTriggered={setResetTriggered}
            resetTriggered={resetTriggered}
          />
        </div>
        <Headline text={"Choose vessel"} />
        <DropwDown options={platforms} option_keys={["platform_id", "name"]} setSelection={selectPlatform} />

        <Headline text={"Choose region"} />
        <DropwDown options={regions} option_keys={["name"]} setSelection={selectRegion} />
        <div className="flex justify-center">
          <Button text="Apply" onClick={onApplyClicked} />
        </div>
      </CardWrapper>
    </div>
  );
};

export default MeasurementSelection;
