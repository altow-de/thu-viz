import { Deployment } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { DeploymentTableData } from "../types";
import { DataStore } from "../store/dataStore";

export class DeploymentService extends FrontendDbService {
  constructor(dataStore: DataStore) {
    super("/api/deployment/", dataStore);
  }

  getAllData(): Promise<Deployment[]> {
    return this.fetchData("getAllData");
  }

  getDeploymentsByLogger(logger_id: number): Promise<Deployment[]> {
    return this.fetchData(`getDeploymentsByLogger?logger_id=${logger_id}`);
  }

  getDeploymentById(deployment_id: number, logger_id: number): Promise<DeploymentTableData> {
    return this.fetchData(`getDeploymentById?deployment_id=${deployment_id}&logger_id=${logger_id}`);
  }
}
