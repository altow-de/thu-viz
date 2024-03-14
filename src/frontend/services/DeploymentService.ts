import { Deployment } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { DeploymentTableData, Region } from "../types";
import { DataStore } from "../store/dataStore";
import { OverviewDeploymentTrackData } from "@/backend/services/DeploymentService";

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

  getOverviewDeploymentDataByTimePlatformAndRegion(
    region?: Region,
    platform_id?: number,
    time_start?: Date,
    time_end?: Date
  ): Promise<OverviewDeploymentTrackData[]> {
    return this.fetchData(
      `getOverviewDeploymentDataByTimePlatformAndRegion?region=${JSON.stringify(
        region
      )}&platform_id=${platform_id}&time_start=${time_start}&time_end=${time_end}`
    );
  }
}
