import { createContext, useContext } from "react";
import { DataStore } from "./dataStore";

// Initialize the DataStore instance
const dataStore = new DataStore();

// Combine all stores into a single object for easy context management
const stores = {
  data: dataStore,
};

// Create a React context with the stores object
export const StoreContext = createContext(stores);

/**
 * Custom hook to access the stores context.
 *
 * @returns {typeof stores} The stores object containing all the individual stores.
 */
export const useStore = () => {
  return useContext(StoreContext) as typeof stores;
};

export default stores;
