import { EmptyDatabaseResult } from "@/frontend/constants";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { DatabaseError } from "./DatabaseError";

/**
 * Service class for handling platform-related operations.
 */
export class PlatformService extends BackendDbService {
  constructor() {
    super("Platform");
  }

  /**
   * Retrieves platforms combined with vessels.
   * @returns {Promise<any[]>} - A promise that resolves with the list of platforms combined with vessels.
   * @throws {DatabaseError | EmptyDatabaseResult} - Throws an error if the database operation fails or no platforms are found.
   */
  async getPlatformsCombinedWithVessels() {
    try {
      const result = await db
        .selectFrom("Platform")
        .rightJoin("Vessel", "Platform.platform_id", "Vessel.platform_id")
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

/**
 * Type representing platforms combined with vessels.
 */
export type PlatformsCombinedWithVessels = Awaited<
  ReturnType<PlatformService["getPlatformsCombinedWithVessels"]>
>[number];
