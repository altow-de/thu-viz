import { NavigationPage } from "@/frontend/constants";
import { useStore } from "@/frontend/store";

export interface NavProps {
  selectedNav: number;
  setSelectedNav: (selected: number) => void;
}

/**
 * Nav component.
 *
 * This component renders the navigation menu of the application.
 *
 * @param {Object} props - The component props.
 * @param {number} props.selectedNav - The currently selected navigation index.
 * @param {Function} props.setSelectedNav - The function to set the selected navigation index.
 * @returns {JSX.Element} The Nav component.
 */
const Nav = ({ selectedNav, setSelectedNav }: NavProps) => {
  const { data: dataStore } = useStore();

  /**
   * Handles the navigation item click event.
   *
   * @param {number} index - The index of the clicked navigation item.
   */
  const handleNavClick = (index: number) => {
    dataStore.setSelectedNav(index);
    setSelectedNav(index);
  };

  return (
    <div className="h-8 flex flex-1 w-full justify-center sm:justify-end items-end sm:items-center text-danube-950 gap-6">
      {NavigationPage.map((page, index) => {
        return (
          <div
            key={index}
            onClick={() => handleNavClick(index)}
            className={`font-medium cursor-pointer ${
              index === selectedNav
                ? "text-danube-500 underline underline-offset-[6px] decoration-2"
                : " hover:text-danube-500"
            }`}
          >
            {page}
          </div>
        );
      })}
    </div>
  );
};

export default Nav;
