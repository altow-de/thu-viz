import { db } from "../db";
import { BackendDbService } from "./BackendDbService";

export class PlatformService extends BackendDbService {
  constructor() {
    super("Platform");
  }

  async getPlatformsCombinedWithVessels() {
    const result = await db
      .selectFrom("Platform")
      .rightJoin("Vessel", "Platform.platform_id", "Vessel.platform_id")
      .selectAll()
      .execute();
    return result;
  }
}
export type PlatformsCombinedWithVessels = Awaited<
  ReturnType<PlatformService["getPlatformsCombinedWithVessels"]>
>[number];
