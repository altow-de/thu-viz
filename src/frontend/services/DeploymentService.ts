import { Deployment } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { DeploymentTableData, Region } from "../types";
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

  async getOverviewDeploymentDataByTimePlatformAndRegion(
    region?: Region,
    platform_id?: number,
    time_start?: Date,
    time_end?: Date
  ) {
    return fetch("/api/deployment/getOverviewDeploymentDataByTimePlatformAndRegion", {
      // Der Pfad zu Ihrer API-Endpunkt
      method: "POST", // Methode auf POST setzen
      headers: {
        "Content-Type": "application/json", // Content-Type setzen
      },
      body: JSON.stringify({ region, platform_id, time_start, time_end }), // Daten in String umwandeln und als Body der Anfrage senden
    }).then((res) => {
      if (!res.ok) {
        const message = `An error has occurred: ${res.statusText}`;
        throw new Error(message);
      }

      const deploymentTrackData = res.json(); // Antwort als JSON erhalten
      return deploymentTrackData;
    });
  }
}
