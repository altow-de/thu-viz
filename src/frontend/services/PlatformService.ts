import { Platform } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { PlatformsCombinedWithVessels } from "@/backend/services/PlatformService";
import { DataStore } from "../store/dataStore";

export class PlatformService extends FrontendDbService {
  constructor(dataStore: DataStore) {
    super("/api/platform/", dataStore);
  }

  getAllData(): Promise<Platform[]> {
    return this.fetchData("getAllData");
  }

  getPlatformsCombinedWithVessels(): Promise<PlatformsCombinedWithVessels[]> {
    return this.fetchData("getPlatformsCombinedWithVessels");
  }
}
