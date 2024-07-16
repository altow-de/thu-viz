import { EmptyDatabaseResult } from "@/frontend/constants";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { DatabaseError } from "./DatabaseError";

/**
 * Service class for handling logger-related operations.
 */
export class LoggerService extends BackendDbService {
  constructor() {
    super("Logger");
  }

  /**
   * Retrieves loggers that have associated deployments and processed values.
   * @returns {Promise<any[]>} - A promise that resolves with the list of loggers.
   * @throws {DatabaseError | EmptyDatabaseResult} - Throws an error if the database operation fails or no loggers are found.
   */
  async getLoggersWithDeployments() {
    try {
      const result = await db
        .selectFrom("Logger")
        .where(({ and, exists, selectFrom }) =>
          and([
            exists(
              selectFrom("Deployment")
                .select("Deployment.logger_id")
                .whereRef("Deployment.logger_id", "=", "Logger.logger_id")
            ),
            exists(
              selectFrom("ProcessedValueHasRawValue")
                .select("ProcessedValueHasRawValue.logger_id")
                .whereRef("ProcessedValueHasRawValue.logger_id", "=", "Logger.logger_id")
            ),
          ])
        )
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
