import { Anker } from "@/frontend/types";
import { useClickAway } from "@uidotdev/usehooks";
import React, { LegacyRef, useState } from "react";
import MenuIcon from "../icons/MenuIcon";
import ScrollTopIcon from "../icons/ScrollTopIcon";

interface AnkerMenuProps {
  ankers: Anker[];
}

const AnkerMenu = ({ ankers }: AnkerMenuProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useClickAway(() => {
    setOpen(false);
  }) as LegacyRef<HTMLDivElement>;

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setOpen(false);
    }
  };

  const menuEntry = (id: string, title?: string) => {
    return (
      <div
        key={id}
        onClick={() => scrollToId(id)}
        className="hover:bg-danube-50 text-center p-1 bg-white flex-1 items-center flex items-center justify-center font-semibold border-l border-gray-custom last:rounded-br-lg "
      >
        <div className="">{title}</div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={`fixed bg-white shadow-md text-xs z-50 text-danube-600 block md:hidden cursor-pointer right-0 rounded-lg ${
        open ? "right-0 top-0 w-full" : " top-6"
      }`}
    >
      {!open && (
        <div className="w-auto h-auto rounded-full border-danube-400 border-1 p-2 flex " onClick={() => setOpen(true)}>
          <MenuIcon />
        </div>
      )}
      {open && (
        <div className="w-full flex flex-col rounded-lg">
          <div className="flex flex-1 justify-center items-stretch flex-wrap w-auto flex-row  rounded-lg">
            <div
              onClick={() => scrollToId("header")}
              className="hover:text-danube-900 text-center p-1 bg-white flex-1 items-center flex items-center justify-center font-semibold max-w-10 hover:bg-danube-50 rounded-bl-lg"
            >
              <ScrollTopIcon />
            </div>
            {ankers.map((anker: Anker) => {
              return menuEntry(anker.id, anker.title);
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnkerMenu;
