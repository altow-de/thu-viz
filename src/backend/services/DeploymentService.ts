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
      .selectAll()
      .execute();
    return result;
  }
}
