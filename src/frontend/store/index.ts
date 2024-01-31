import { createContext, useContext } from "react";
import { DataStore } from "./dataStore";

const dataStore = new DataStore();

const stores = {
  data: dataStore,
};

export const StoreContext = createContext(stores);

export const useStore = () => {
  return useContext(StoreContext) as typeof stores;
};

export default stores;
