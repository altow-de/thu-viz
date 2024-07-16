import React, { useEffect, useState } from "react";
import Nav, { NavProps } from "./Nav";
import { observer } from "mobx-react-lite";
import { useStore } from "@/frontend/store";
import DatabaseErrorComponent from "../pages/DatabaseError";

/**
 * Header component.
 *
 * This component renders the header section of the application, including the navigation bar and the error message component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.selectedNav - The currently selected navigation item.
 * @param {Function} props.setSelectedNav - The function to set the selected navigation item.
 * @returns {JSX.Element} The Header component.
 */
const Header = ({ selectedNav, setSelectedNav }: NavProps) => {
  const { data: dataStore } = useStore();
  const [errorTimer, setErrorTimer] = useState<number | null>(null);

  /**
   * Effect to handle error message timeout.
   *
   * This effect sets a timeout to clear the error message after 5 seconds.
   * It also cleans up the timeout when the component is unmounted or when the error changes.
   */
  useEffect(() => {
    if (dataStore.error !== null) {
      const timerId = setTimeout(() => {
        dataStore.setError(null);
      }, 5000);
      setErrorTimer(Number(timerId));
    }

    return () => {
      if (errorTimer !== null) {
        clearTimeout(errorTimer);
      }
    };
  }, [dataStore.error]);

  return (
    <div className="relative">
      <div className="h-28 flex px-4 pt-5 pb-2 sm:px-8 items-center flex-col sm:flex-row w-full" id="header">
        <img src="HyFive-Logo schwarz-blau.svg" alt="Hyfive Logo" className="h-8 flex-0" />
        <Nav selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
      </div>
      {dataStore.error !== null && (
        <DatabaseErrorComponent message={dataStore.error ? dataStore.error?._message : ""} />
      )}
    </div>
  );
};

export default observer(Header);
