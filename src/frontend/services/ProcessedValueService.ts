import { ProcessedValue } from "@/backend/entities";
import { FrontendDbService } from "./FrontendDbService";
import { DataStore } from "../store/dataStore";
import { DatabaseError } from "@/backend/services/DatabaseError";
import {
  DiagramDataForParameterAndDeployment,
  ParameterDataForDeployment,
  TrackData,
} from "@/backend/services/ProcessedValueService";

/**
 * Service class for processed value operations.
 *
 * This class extends the FrontendDbService and provides methods for fetching processed value data.
 *
 * @param {DataStore} dataStore - The data store instance.
 */
export class ProcessedValueService extends FrontendDbService {
  constructor(dataStore: DataStore) {
    super("/api/processedvalue/", dataStore);
  }

  /**
   * Fetch all processed value data.
   *
   * @returns {Promise<ProcessedValue[]>} - A promise that resolves to the list of all processed values.
   */
  getAllData(): Promise<ProcessedValue[]> {
    return this.fetchData("getAllData");
  }

  /**
   * Fetch diagram data for a specific parameter and deployment.
   *
   * @param {number} deployment_id - The ID of the deployment.
   * @param {number} logger_id - The ID of the logger.
   * @param {number} sensor_type_id - The ID of the sensor type.
   * @returns {Promise<DiagramDataForParameterAndDeployment[] | DatabaseError>} - A promise that resolves to the diagram data or a database error.
   */
  getDiagramDataForParameterAndDeployment(
    deployment_id: number,
    logger_id: number,
    sensor_type_id: number
  ): Promise<DiagramDataForParameterAndDeployment[] | DatabaseError> {
    return this.fetchData(
      `getDiagramDataForParameterAndDeployment?deployment_id=${deployment_id}&logger_id=${logger_id}&sensor_type_id=${sensor_type_id}`
    );
  }

  /**
   * Fetch parameter data for a specific deployment.
   *
   * @param {number} deployment_id - The ID of the deployment.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<ParameterDataForDeployment[] | DatabaseError>} - A promise that resolves to the parameter data or a database error.
   */
  getParameterDataForDeployment(
    deployment_id: number,
    logger_id: number
  ): Promise<ParameterDataForDeployment[] | DatabaseError> {
    return this.fetchData(`getParameterDataForDeployment?deployment_id=${deployment_id}&logger_id=${logger_id}`);
  }

  /**
   * Fetch track data for a specific logger and deployment.
   *
   * @param {number} deployment_id - The ID of the deployment.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<TrackData[] | DatabaseError>} - A promise that resolves to the track data or a database error.
   */
  getTrackDataByLoggerAndDeployment(deployment_id: number, logger_id: number): Promise<TrackData[] | DatabaseError> {
    return this.fetchData(`getTrackDataByLoggerAndDeployment?deployment_id=${deployment_id}&logger_id=${logger_id}`);
  }
}
