import { sql } from "kysely";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { Region } from "@/frontend/types";

export class DeploymentService extends BackendDbService {
  constructor() {
    super("Deployment");
  }

  async getOverviewDeploymentDataByTimePlatformAndRegion(
    time_start: Date,
    time_end: Date,
    platform_id: number,
    region: Region
  ) {}

  async getOverviewDeploymentData() {
    const deepestSubquery = db
      .selectFrom("ProcessedValueHasRawValue")
      .innerJoin("ProcessedValue", "ProcessedValue.processed_value_id", "ProcessedValueHasRawValue.processed_value_id")
      .select("ProcessedValueHasRawValue.deployment_id")
      .select(sql`MIN(ProcessedValue.depth)`.as("deepest"))
      .where("ProcessedValue.valid", "=", 1)
      .groupBy("ProcessedValueHasRawValue.deployment_id")
      .as("dpst");

    const result = await db
      .selectFrom("Deployment")
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom("ProcessedValueHasRawValue")
            .select("ProcessedValueHasRawValue.deployment_id")
            .whereRef("ProcessedValueHasRawValue.deployment_id", "=", "Deployment.deployment_id")
        )
      )

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
      ])
      .limit(2000)
      .execute();
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

export type OverviewDeploymentData = Awaited<ReturnType<DeploymentService["getOverviewDeploymentData"]>>[number];
