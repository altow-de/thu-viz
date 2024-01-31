import React from "react";
import Nav, { NavProps } from "./Nav";
import { observer } from "mobx-react-lite";
import { useStore } from "@/frontend/store";
import DatabaseErrorComponent from "../pages/DatabaseError";

const Header = ({ selectedNav, setSelectedNav }: NavProps) => {
  const { data: dataStore } = useStore();

  return (
    <div>
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
