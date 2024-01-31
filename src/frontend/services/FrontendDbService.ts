import { DataStore } from "../store/dataStore";

export abstract class FrontendDbService {
  protected apiPath: string;
  protected dataStore: DataStore;

  constructor(apiPath: string, dataStore: DataStore) {
    this.apiPath = apiPath;
    this.dataStore = dataStore;
  }

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

  abstract getAllData(): Promise<any>;
}
