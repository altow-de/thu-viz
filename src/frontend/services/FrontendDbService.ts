import { DataStore } from "../store/dataStore";

/**
 * Abstract class FrontendDbService.
 *
 * This class provides the basic structure for services that interact with the frontend database.
 *
 * @param {string} apiPath - The base path for the API.
 * @param {DataStore} dataStore - The data store instance.
 */
export abstract class FrontendDbService {
  protected apiPath: string;
  protected dataStore: DataStore;

  constructor(apiPath: string, dataStore: DataStore) {
    this.apiPath = apiPath;
    this.dataStore = dataStore;
  }

  /**
   * Fetch data from the API.
   *
   * @param {string} endpoint - The API endpoint to fetch data from.
   * @returns {Promise<any>} - A promise that resolves to the fetched data.
   */
  protected async fetchData(endpoint: string): Promise<any> {
    return fetch(this.apiPath + endpoint)
      .then((res) => res.json())
      .then((e) => {
        if (e._error) {
          this.dataStore.setError(e);
        }
        return e;
      });
  }

  /**
   * Abstract method to fetch all data.
   *
   * This method must be implemented by subclasses to fetch all relevant data.
   *
   * @returns {Promise<any>} - A promise that resolves to the fetched data.
   */
  abstract getAllData(): Promise<any>;
}
