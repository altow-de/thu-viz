import { Anker } from "@/frontend/types";
import { useClickAway } from "@uidotdev/usehooks";
import React, { LegacyRef, useState } from "react";
import MenuIcon from "../icons/MenuIcon";

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

  return (
    <div
      ref={ref}
      className="fixed right-4 top-8 bg-white rounded-lg shadow-md p-2 text-xs z-50 text-danube-900 block md:hidden sm:right-8 cursor-pointer"
    >
      {!open && (
        <div className="w-auto h-auto rounded-full" onClick={() => setOpen(true)}>
          <MenuIcon />
        </div>
      )}
      {open && (
        <div className="">
          <div className="font-semibold mb-1">Scroll To:</div>
          {ankers.map((anker: Anker) => {
            return (
              <div key={anker.id} onClick={() => scrollToId(anker.id)} className="max-w-20">
                {anker.title}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AnkerMenu;
