import { Logger } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { DataStore } from "../store/dataStore";

export class LoggerService extends FrontendDbService {
  constructor(dataStore: DataStore) {
    super("/api/logger/", dataStore);
  }

  getAllData(): Promise<Logger[]> {
    return this.fetchData("getAllData");
  }

  getLoggersWithDeployments(): Promise<Logger[]> {
    return this.fetchData("getLoggersWithDeployments");
  }
}
