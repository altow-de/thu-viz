import { Platform } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { PlatformsCombinedWithVessels } from "@/backend/services/PlatformService";
import { DataStore } from "../store/dataStore";

/**
 * Service class for Platform operations.
 *
 * This class extends the FrontendDbService and provides methods for fetching platform data.
 *
 * @param {DataStore} dataStore - The data store instance.
 */
export class PlatformService extends FrontendDbService {
  constructor(dataStore: DataStore) {
    super("/api/platform/", dataStore);
  }

  /**
   * Fetch all platform data.
   *
   * @returns {Promise<Platform[]>} - A promise that resolves to the list of all platforms.
   */
  getAllData(): Promise<Platform[]> {
    return this.fetchData("getAllData");
  }

  /**
   * Fetch platforms combined with vessels.
   *
   * @returns {Promise<PlatformsCombinedWithVessels[]>} - A promise that resolves to the list of platforms combined with vessels.
   */
  getPlatformsCombinedWithVessels(): Promise<PlatformsCombinedWithVessels[]> {
    return this.fetchData("getPlatformsCombinedWithVessels");
  }
}
