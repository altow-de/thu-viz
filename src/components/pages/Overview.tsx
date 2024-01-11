import { MapType } from "@/frontend/enum";
import React, { useState } from "react";
import { DateValueType } from "react-tailwindcss-datepicker";
import DatePicker from "../basic/DatePicker";
import OceanMap from "../map/Map";
import CardWraper from "../wrapper/CardWrapper";

const Overview = () => {
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
    <>
      <CardWraper text={"Position of Deployments (Startposition)"} hasMap={false}>
        <div className="flex flex-col sm:flex-row gap-1">
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
      </CardWraper>
      <CardWraper text={"Position of Deployments (Startposition)"} hasMap={true}>
        <OceanMap type={MapType.point} />
      </CardWraper>
    </>
  );
};
export default Overview;
