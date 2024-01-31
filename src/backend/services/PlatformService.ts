import { EmptyDatabaseResult } from "@/frontend/constants";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { DatabaseError } from "./DatabaseError";

export class PlatformService extends BackendDbService {
  constructor() {
    super("Platform");
  }

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
export type PlatformsCombinedWithVessels = Awaited<
  ReturnType<PlatformService["getPlatformsCombinedWithVessels"]>
>[number];
