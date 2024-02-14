import { db } from "../db";
import { BackendDbService } from "./BackendDbService";

export class DeploymentService extends BackendDbService {
  constructor() {
    super("Deployment");
  }

  async getDeploymentsByLogger(logger_id: number) {
    const result = await db
      .selectFrom("Deployment")
      .where("Deployment.logger_id", "=", logger_id)
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom("ProcessedValueHasRawValue")
            .select("ProcessedValueHasRawValue.logger_id")
            .whereRef("ProcessedValueHasRawValue.logger_id", "=", "Deployment.logger_id")
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
