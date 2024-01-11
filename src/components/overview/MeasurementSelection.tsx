import React, { useState } from "react";
import { DateValueType } from "react-tailwindcss-datepicker";
import "../../../styles/dropdown.css";
import Button from "../basic/Button";
import DatePicker from "../basic/DatePicker";
import DropwDown from "../basic/Dropdown";
import Headline from "../basic/Headline";
import CardWrapper from "../wrapper/CardWrapper";

interface MeasurementSelectionProps {}

const MeasurementSelection: React.FC<MeasurementSelectionProps> = () => {
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
      <CardWrapper text={"Selection of measurement data"} hasMap={false}>
        <Headline text={"Choose time range"} />
        <div className="flex flex-col md:flex-row gap-1 z-40">
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
        <DropwDown options={["platform 1", "platform 1", "platform 1", "platform 1", "platform 1"]} />

        <Headline text={"Choose region"} />
        <DropwDown options={["region 1", "region 1", "region 1", "region 1", "region 1"]} />

        <Button text="Apply" />
      </CardWrapper>
    </div>
  );
};

export default MeasurementSelection;
