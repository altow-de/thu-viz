import { Deployment } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";

export class DeploymentService extends FrontendDbService {
  constructor() {
    super("/api/deployment/");
  }

  getAllData(): Promise<Deployment[]> {
    return this.fetchData("getAllData");
  }

  getDeploymentsByLogger(logger_id: number): Promise<Deployment[]> {
    return this.fetchData(`getDeploymentsByLogger?logger_id=${logger_id}`);
  }
}
