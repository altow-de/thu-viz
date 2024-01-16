import { Platform } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { PlatformsCombinedWithVessels } from "@/backend/services/PlatformService";

export class PlatformService extends FrontendDbService {
  constructor() {
    super("/api/platform/");
  }

  getAllData(): Promise<Platform[]> {
    return this.fetchData("getAllData");
  }

  getPlatformsCombinedWithVessels(): Promise<PlatformsCombinedWithVessels[]> {
    return this.fetchData("getPlatformsCombinedWithVessels");
  }
}
