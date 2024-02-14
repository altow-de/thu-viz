import { sql } from "kysely";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";

export class DeploymentService extends BackendDbService {
  constructor() {
    super("Deployment");
  }

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
      .execute();
    return result;
  }

  async getDeploymentsByLogger(logger_id: number) {
    const result = await db
      .selectFrom("Deployment")
      .where("Deployment.logger_id", "=", logger_id)
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom("ProcessedValueHasRawValue")
            .select("ProcessedValueHasRawValue.deployment_id")
            .whereRef("ProcessedValueHasRawValue.deployment_id", "=", "Deployment.deployment_id")
        )
      )
      .selectAll()
      .execute();
    return result;
  }

  async getDeploymentById(logger_id: number, deployment_id: number) {
    const result = await db
      .selectFrom("Deployment")
      .where("Deployment.logger_id", "=", logger_id)
      .where("Deployment.deployment_id", "=", deployment_id)
      .rightJoin("PlatformContainsLogger", "PlatformContainsLogger.logger_id", "Deployment.logger_id")
      .rightJoin("Vessel", "Vessel.platform_id", "PlatformContainsLogger.platform_id")
      .selectAll()
      .executeTakeFirst();
    return result;
  }
}

export type OverviewDeploymentData = Awaited<ReturnType<DeploymentService["getOverviewDeploymentData"]>>[number];
