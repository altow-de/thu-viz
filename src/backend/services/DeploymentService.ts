import { sql } from "kysely";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { Region } from "@/frontend/types";
import { format } from "date-fns";
import { isValidDate } from "@/frontend/utils";

export class DeploymentService extends BackendDbService {
  constructor() {
    super("Deployment");
  }

  async getOverviewDeploymentDataByTimePlatformAndRegion(
    time_start?: Date,
    time_end?: Date,
    platform_id?: number,
    region?: Region
  ) {
    let logger_ids: number[] = [];

    if (platform_id && Number(platform_id) > -1) {
      const logger = await db
        .selectFrom("PlatformContainsLogger")
        .where("PlatformContainsLogger.platform_id", "=", platform_id)
        .select("PlatformContainsLogger.logger_id")
        .groupBy("PlatformContainsLogger.logger_id")
        .execute();

      logger_ids = logger.map((logger) => logger.logger_id);
    }
    let query = db.selectFrom("Deployment");
    const deepestSubquery = db
      .selectFrom("ProcessedValueHasRawValue")
      .innerJoin("ProcessedValue", "ProcessedValue.processed_value_id", "ProcessedValueHasRawValue.processed_value_id")
      .select("ProcessedValueHasRawValue.deployment_id")
      .select(sql`MIN(ProcessedValue.pressure)`.as("deepest"))
      .where("ProcessedValue.valid", "=", 1)
      .groupBy("ProcessedValueHasRawValue.deployment_id")
      .as("dpst");

    if (isValidDate(time_start) || isValidDate(time_end) || logger_ids?.length > 0 || region !== undefined) {
      query = query.where((eb: any) => {
        const conditions = [];

        if (isValidDate(time_start)) {
          const formatedStartDate = format(time_start as Date, "yyyy-MM-dd HH:mm:ss");
          conditions.push(eb("Deployment.time_start", ">=", formatedStartDate as unknown as Date));
        }
        if (isValidDate(time_end)) {
          const formatedEndDate = format(time_end as Date, "yyyy-MM-dd HH:mm:ss");
          conditions.push(eb("Deployment.time_end", "<=", formatedEndDate as unknown as Date));
        }
        if (logger_ids?.length > 0) {
          conditions.push(eb("Deployment.logger_id", "in", logger_ids));
        }

        if (region) {
          const polygon = region.polygon.toString();
          conditions.push(eb(sql`ST_Contains(ST_GeomFromText(${polygon}), Deployment.position_start)`, "=", true));
        }
        return conditions.length > 0 ? eb.and(conditions) : eb;
      });
    }
    query = query
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom("ProcessedValueHasRawValue")
            .select("ProcessedValueHasRawValue.deployment_id")
            .whereRef("ProcessedValueHasRawValue.deployment_id", "=", "Deployment.deployment_id")
        )
      )
      .where(sql`ST_AsText(Deployment.position_start)`, "!=", "POINT(-999 -999)")
      .innerJoin("PlatformContainsLogger", "Deployment.logger_id", "PlatformContainsLogger.logger_id")
      .innerJoin("Platform", "Platform.platform_id", "PlatformContainsLogger.platform_id")
      .innerJoin("Vessel", "Platform.platform_id", "Vessel.platform_id")
      .innerJoin(deepestSubquery, (join) => join.onRef("dpst.deployment_id", "=", "Deployment.deployment_id"))
      .orderBy(["Deployment.deployment_id", "Deployment.logger_id"])
      .groupBy(["Deployment.deployment_id", "Deployment.logger_id"])
      .select([
        "Deployment.deployment_id",
        "Deployment.logger_id",
        "Vessel.name",
        "Deployment.time_start",
        "dpst.deepest",
        "Deployment.time_end",
        "Deployment.position_start",
      ]);

    const result = await query.limit(2000).execute();

    return result;
  }

  async getDeploymentsByLogger(logger_id: number) {
    const result = await db
      .selectFrom("Deployment")
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom("ProcessedValueHasRawValue")
            .select("ProcessedValueHasRawValue.deployment_id")
            .whereRef("ProcessedValueHasRawValue.deployment_id", "=", "Deployment.deployment_id")
            .where("ProcessedValueHasRawValue.logger_id", "=", logger_id)
        )
      )
      .selectAll()
      .groupBy(["Deployment.deployment_id"])
      .execute();
    return result;
  }

  async getDeploymentById(logger_id: number, deployment_id: number) {
    const result = await db
      .selectFrom("Deployment")
      .where(({ eb, and }) =>
        and([eb("Deployment.logger_id", "=", logger_id), eb("Deployment.deployment_id", "=", deployment_id)])
      )
      .innerJoin("PlatformContainsLogger", "PlatformContainsLogger.logger_id", "Deployment.logger_id")
      .innerJoin("Vessel", "Vessel.platform_id", "PlatformContainsLogger.platform_id")
      .select([
        "Deployment.time_start",
        "Deployment.time_end",
        "Deployment.position_start",
        "Deployment.position_end",
        "Vessel.name",
      ])
      .executeTakeFirst();
    return result;
  }
}

export type OverviewDeploymentTrackData = Awaited<
  ReturnType<DeploymentService["getOverviewDeploymentDataByTimePlatformAndRegion"]>
>[number];
