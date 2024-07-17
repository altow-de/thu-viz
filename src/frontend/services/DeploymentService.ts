import { Deployment } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { DeploymentTableData, Region } from "../types";
import { DataStore } from "../store/dataStore";

/**
 * DeploymentService class.
 *
 * This class provides methods to interact with the deployment API.
 *
 * @param {DataStore} dataStore - The data store instance.
 */
export class DeploymentService extends FrontendDbService {
  constructor(dataStore: DataStore) {
    super("/api/deployment/", dataStore);
  }

  /**
   * Fetch all deployment data.
   *
   * @returns {Promise<Deployment[]>} - A promise that resolves to an array of Deployment objects.
   */
  getAllData(): Promise<Deployment[]> {
    return this.fetchData("getAllData");
  }

  /**
   * Fetch deployments by logger ID.
   *
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<Deployment[]>} - A promise that resolves to an array of Deployment objects.
   */
  getDeploymentsByLogger(logger_id: number): Promise<Deployment[]> {
    return this.fetchData(`getDeploymentsByLogger?logger_id=${logger_id}`);
  }

  /**
   * Fetch a deployment by its ID and logger ID.
   *
   * @param {number} deployment_id - The ID of the deployment.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<DeploymentTableData>} - A promise that resolves to a DeploymentTableData object.
   */
  getDeploymentById(deployment_id: number, logger_id: number): Promise<DeploymentTableData> {
    return this.fetchData(`getDeploymentById?deployment_id=${deployment_id}&logger_id=${logger_id}`);
  }

  /**
   * Fetch overview deployment data filtered by time, platform, and region.
   *
   * @param {Region} [region] - The region to filter by.
   * @param {number} [platform_id] - The platform ID to filter by.
   * @param {Date} [time_start] - The start date to filter by.
   * @param {Date} [time_end] - The end date to filter by.
   * @returns {Promise<any>} - A promise that resolves to the deployment track data.
   */
  async getOverviewDeploymentDataByTimePlatformAndRegion(
    region?: Region,
    platform_id?: number,
    time_start?: Date,
    time_end?: Date
  ): Promise<any> {
    return fetch("/api/deployment/getOverviewDeploymentDataByTimePlatformAndRegion", {
      method: "POST", // Set method to POST
      headers: {
        "Content-Type": "application/json", // Set Content-Type to JSON
      },
      body: JSON.stringify({ region, platform_id, time_start, time_end }), // Convert data to JSON string and send as body
    }).then((res) => {
      if (!res.ok) {
        const message = `An error has occurred: ${res.statusText}`;
        throw new Error(message);
      }

      return res.json(); // Parse and return the JSON response
    });
  }
}
