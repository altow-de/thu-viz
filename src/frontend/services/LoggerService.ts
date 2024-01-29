import { Logger } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";

export class LoggerService extends FrontendDbService {
  constructor() {
    super("/api/logger/");
  }

  getAllData(): Promise<Logger[]> {
    return this.fetchData("getAllData");
  }

  getLoggersWithDeployments(): Promise<Logger[]> {
    return this.fetchData("getLoggersWithDeployments");
  }
}
