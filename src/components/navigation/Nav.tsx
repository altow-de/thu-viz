import { NavigationPage } from "@/frontend/constants";
import { useStore } from "@/frontend/store";

export interface NavProps {
  selectedNav: number;
  setSelectedNav: (selected: number) => void;
}

const Nav = ({ selectedNav, setSelectedNav }: NavProps) => {
  const { data: dataStore } = useStore();
  return (
    <div className="h-8 flex flex-1 w-full justify-center sm:justify-end items-end sm:items-center text-danube-950 gap-6">
      {NavigationPage.map((page, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              dataStore.setSelectedNav(index);
              setSelectedNav(index);
            }}
            className={`font-medium cursor-pointer	 ${
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
