import { Anchor } from "@/frontend/types";
import { useClickAway } from "@uidotdev/usehooks";
import React, { LegacyRef, useState } from "react";
import MenuIcon from "../icons/MenuIcon";
import Close from "../basic/Close";
import ScrollTopIcon from "../icons/ScrollTopIcon";

interface AnchorMenuProps {
  anchors: Anchor[];
}

/**
 * AnchorMenu component.
 *
 * This component renders a menu that allows the user to scroll to different sections of the page.
 *
 * @param {Object} props - The component props.
 * @param {Anchor[]} props.anchors - The list of anchor objects containing id and title.
 * @returns {JSX.Element} The AnchorMenu component.
 */
const AnchorMenu = ({ anchors }: AnchorMenuProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useClickAway(() => {
    setOpen(false);
  }) as LegacyRef<HTMLDivElement>;

  /**
   * Scrolls the view to the element with the specified ID.
   *
   * @param {string} id - The ID of the element to scroll to.
   */
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

  /**
   * Creates a menu entry.
   *
   * @param {string} id - The ID of the element to scroll to when the menu entry is clicked.
   * @param {string} [title] - The title of the menu entry.
   * @returns {JSX.Element} The menu entry component.
   */
  const menuEntry = (id: string, title?: string) => {
    return (
      <div
        key={id}
        onClick={() => scrollToId(id)}
        className="hover:text-danube-200 py-4 flex-1 items-center flex font-semibold border-b last:border-b-0 border-danube-500"
      >
        <div className="text-sm">{title}</div>
      </div>
    );
  };

  return (
    <div ref={ref} className={`fixed text-xs z-50 text-white block md:hidden cursor-pointer top-40 right-0`}>
      {!open && (
        <div className="w-auto h-auto p-2 flex shadow-md bg-danube-600 rounded-l-full" onClick={() => setOpen(true)}>
          <MenuIcon />
        </div>
      )}
      {open && (
        <div className="w-full max-w-78 flex flex-row">
          <div className="color-white rounded-l-full p-3 bg-danube-600 w-12 h-12 shadow-md">
            <Close onClick={() => setOpen(false)} style="hover:text-danube-200" />
          </div>

          <div className="flex flex-1 flex-col flex-row bg-danube-600 rounded-bl-lg px-4 bg-danube-600">
            <div
              onClick={() => scrollToId("header")}
              className="hover:text-danube-200 flex-1 items-center flex text-right py-3 border-danube-500 border-b w-full flex-row"
            >
              <div className="hover:text-danube-200 text-sm font-semibold flex-1 text-left">Scroll to top</div>
              <div className="self-end flex-0">
                <ScrollTopIcon />
              </div>
            </div>
            {anchors.map((anchor: Anchor) => {
              return menuEntry(anchor.id, anchor.title);
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnchorMenu;
