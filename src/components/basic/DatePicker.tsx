import React, { useEffect } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

interface DatePickerProps {
  placeholder: string;
  startDate: Date | null;
  selectedDate: DateValueType;
  setSelectedDate: (selectedDate: DateValueType) => void;
  resetTriggered?: boolean;
  setResetTriggered?: (resetTriggered: boolean) => void;
}

/**
 * A reusable date picker component.
 * @param {DatePickerProps} props - The props for the date picker component.
 * @returns {JSX.Element} - The rendered date picker component.
 */
const DatePicker = ({
  placeholder,
  startDate,
  selectedDate,
  setSelectedDate,
  resetTriggered,
  setResetTriggered,
}: DatePickerProps): JSX.Element => {
  /**
   * Handles the change event for the date picker.
   * @param {DateValueType} selectedDate - The selected date.
   * @param {HTMLInputElement | null | undefined} [e] - The event object.
   */
  const handleChange = (selectedDate: DateValueType, e?: HTMLInputElement | null | undefined) => {
    setSelectedDate(selectedDate);
    if (setResetTriggered) setResetTriggered(!resetTriggered);
  };

  useEffect(() => {
    if (resetTriggered) {
      setSelectedDate({ startDate: null, endDate: null });
    }
  }, [resetTriggered]);

  return (
    <div className="mb-4 w-full">
      <Datepicker
        useRange={false}
        disabled={startDate === null}
        toggleClassName="absolute right-0 h-full px-3 text-danube-900 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        inputClassName="relative text-danube-900 border-danube-400 border transition-all duration-300 py-2 pl-4 pr-8 w-full rounded-lg tracking-wide font-light text-sm placeholder-gray-custom bg-white disabled:opacity-40 disabled:cursor-not-allowed outline-danube-600"
        minDate={startDate}
        maxDate={new Date()}
        value={selectedDate}
        onChange={handleChange}
        primaryColor={"sky"}
        asSingle={true}
        placeholder={placeholder}
        popoverDirection="down"
      />
    </div>
  );
};

export default DatePicker;
