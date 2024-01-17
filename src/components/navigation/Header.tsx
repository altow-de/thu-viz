import React from "react";
import Nav, { NavProps } from "./Nav";

const Header = ({ selectedNav, setSelectedNav }: NavProps) => {
  return (
    <div className="h-28 flex px-4 pt-5 pb-2 sm:px-8 items-center flex-col sm:flex-row w-full" id="header">
      <img src="HyFive-Logo schwarz-blau.svg" alt="Hyfive Logo" className="h-8 flex-0" />
      <Nav selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
    </div>
  );
};
export default Header;
