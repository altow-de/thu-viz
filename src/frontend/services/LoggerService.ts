import { Logger } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { DataStore } from "../store/dataStore";

/**
 * Class LoggerService.
 *
 * This class provides methods to interact with the logger-related API endpoints.
 *
 * @extends {FrontendDbService}
 */
export class LoggerService extends FrontendDbService {
  constructor(dataStore: DataStore) {
    super("/api/logger/", dataStore);
  }

  /**
   * Fetch all logger data from the API.
   *
   * @returns {Promise<Logger[]>} - A promise that resolves to an array of Logger data.
   */
  getAllData(): Promise<Logger[]> {
    return this.fetchData("getAllData");
  }

  /**
   * Fetch all loggers with their associated deployments from the API.
   *
   * @returns {Promise<Logger[]>} - A promise that resolves to an array of Logger data with deployments.
   */
  getLoggersWithDeployments(): Promise<Logger[]> {
    return this.fetchData("getLoggersWithDeployments");
  }
}
