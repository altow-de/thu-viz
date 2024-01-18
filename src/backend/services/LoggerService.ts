import { db } from "../db";
import { BackendDbService } from "./BackendDbService";

export class LoggerService extends BackendDbService {
  constructor() {
    super("Logger");
  }

  async getLoggersWithDeployments() {
    const result = await db
      .selectFrom("Deployment")
      .leftJoin("Logger", "Logger.logger_id", "Deployment.logger_id")
      .groupBy("Logger.logger_id")
      .selectAll()
      .execute();
    return result;
  }
}
