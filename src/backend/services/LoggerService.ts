import { EmptyDatabaseResult } from "@/frontend/constants";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { DatabaseError } from "./DatabaseError";

export class LoggerService extends BackendDbService {
  constructor() {
    super("Logger");
  }

  async getLoggersWithDeployments() {
    try {
      const result = await db
        .selectFrom("Deployment")
        .leftJoin("Logger", "Logger.logger_id", "Deployment.logger_id")
        .groupBy("Logger.logger_id")
        .selectAll()
        .execute();
      if (result?.length > 0) {
        return result;
      } else {
        throw EmptyDatabaseResult;
      }
    } catch (error) {
      throw error === EmptyDatabaseResult ? error : new DatabaseError(405, "Database error occurred.", error);
    }
  }
}
