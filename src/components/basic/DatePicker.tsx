import React from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

interface DatePickerProps {
  placeholder: string;
  startDate: Date | null;
  selectedDate: DateValueType;
  setSelectedDate: (selectedDate: DateValueType) => void;
}

const DatePicker = ({ placeholder, startDate, selectedDate, setSelectedDate }: DatePickerProps) => {
  const handleChange = (selectedDate: DateValueType, e?: HTMLInputElement | null | undefined) => {
    setSelectedDate(selectedDate);
  };

  return (
    <div className="mb-4 w-full z-20">
      <Datepicker
        showShortcuts={true}
        useRange={false}
        disabled={startDate === null}
        toggleClassName="absolute right-0 h-full  px-3 text-danube-900 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        inputClassName=" relative text-danube-900 border-danube-400 border transition-all duration-300 py-2 pl-4 pr-8 w-full rounded-lg tracking-wide font-light text-sm placeholder-gray-custom bg-white disabled:opacity-40 disabled:cursor-not-allowed outline-danube-600"
        minDate={startDate}
        maxDate={new Date()}
        value={selectedDate}
        onChange={handleChange}
        primaryColor={"sky"}
        asSingle={true}
        placeholder={placeholder}
      />
    </div>
  );
};

export default DatePicker;
