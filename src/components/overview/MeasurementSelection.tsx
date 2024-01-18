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
import { OverviewAnkers } from "@/frontend/enum";

interface MeasurementSelectionProps {}

const MeasurementSelection: React.FC<MeasurementSelectionProps> = () => {
  const platformService: PlatformService = new PlatformService();
  const [platforms, setPlatforms] = useState<PlatformsCombinedWithVessels[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<number>(-1);
  const [selectedRegion, setSelectedRegion] = useState<number>(-1);

  const selectRegion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(e.target.value);
    setSelectedRegion(selected);
  };

  const selectPlatform = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(e.target.value);
    setSelectedPlatform(selected);
  };

  // { east: [54, 30]
  const regions: Region[] = [
    { name: "Baltic Sea", coords: { north: [60, 30], south: [54, 30], west: [60, 10], east: [54, 30] } },
    {
      name: "North Sea",
      coords: {
        north: [60, 3],
        south: [51, -5],
        west: [60, -10],
        east: [51, 10],
      },
    },
  ];

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
  return (
    <div className="basis-full md:basis-1/3">
      <CardWrapper text={"Selection of measurement data"} hasMap={false} id={OverviewAnkers.MeasurementSelection}>
        <Headline text={"Choose time range"} />
        <div className="flex flex-col md:flex-row gap-1 z-30">
          <DatePicker
            placeholder={"Date from"}
            startDate={startDate}
            selectedDate={dateFrom}
            setSelectedDate={setDateFrom}
          />
          <DatePicker
            placeholder={"Date to"}
            startDate={dateFrom?.endDate ? new Date(dateFrom?.endDate?.toString()) : null}
            selectedDate={dateTo}
            setSelectedDate={setDateTo}
          />
        </div>
        <Headline text={"Choose platform"} />
        <DropwDown options={platforms} option_keys={["name"]} setSelection={selectPlatform} />

        <Headline text={"Choose region"} />
        <DropwDown options={regions} option_keys={["name"]} setSelection={selectRegion} />
        <div className="flex justify-center">
          <Button text="Apply" onClick={() => {}} />
        </div>
      </CardWrapper>
    </div>
  );
};

export default MeasurementSelection;
