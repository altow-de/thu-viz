import { EmptyDatabaseResult } from "@/frontend/constants";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { DatabaseError } from "./DatabaseError";
import { ProcessedValueHasRawValue } from "../entities";
import { sql } from "kysely";

/**
 * Service class for handling processed value-related operations.
 */
export class ProcessedValueService extends BackendDbService {
  constructor() {
    super("ProcessedValue");
  }

  /**
   * Retrieves diagram data for a specific parameter and deployment.
   * @param {number} logger_id - The ID of the logger.
   * @param {number} deployment_id - The ID of the deployment.
   * @param {number} sensor_type_id - The ID of the sensor type.
   * @returns {Promise<any[]>} - A promise that resolves with the diagram data.
   * @throws {DatabaseError | EmptyDatabaseResult} - Throws an error if the database operation fails or no data is found.
   */
  async getDiagramDataForParameterAndDeployment(logger_id: number, deployment_id: number, sensor_type_id: number) {
    try {
      // First retrieve sensor IDs associated with the parameter to optimize the query execution speed.
      const sensors = await db
        .selectFrom("SensorType")
        .innerJoin("Sensor", "SensorType.sensor_type_id", "SensorType.sensor_type_id")
        .select("Sensor.sensor_id")
        .groupBy("Sensor.sensor_id")
        .execute();
      const sensor_ids = sensors.map((sensor) => sensor.sensor_id);

      const sensorDataAggregation = db
        .selectFrom("RawValue as rawValue")
        .leftJoin("ProcessedValueHasRawValue as linkTable", (join) =>
          join
            .onRef("rawValue.raw_value_id", "=", "linkTable.raw_value_id")
            .onRef("rawValue.deployment_id", "=", "linkTable.deployment_id")
            .onRef("rawValue.logger_id", "=", "linkTable.logger_id")
            .onRef("rawValue.sensor_id", "=", "linkTable.sensor_id")
        )
        .where("rawValue.logger_id", "=", logger_id)
        .where("rawValue.deployment_id", "=", deployment_id)
        .where("rawValue.sensor_id", "in", sensor_ids)
        .leftJoin(
          "ProcessedValue as processedValue",
          "linkTable.processed_value_id",
          "processedValue.processed_value_id"
        )
        .where("processedValue.valid", "=", 1)
        .where("rawValue.deployment_id", "=", deployment_id)
        .select([
          "processedValue.processed_value_id",
          "processedValue.measuring_time",
          sql`MAX(processedValue.processing_time)`.as("latest_processing_time"),
          "processedValue.pressure",
          "processedValue.value",
          "processedValue.position",
          "rawValue.sensor_id",
          "rawValue.raw_value_id",
          "rawValue.logger_id",
        ])
        .groupBy(["rawValue.sensor_id", "rawValue.raw_value_id", "rawValue.logger_id", "rawValue.deployment_id"]);

      // Main query with better naming and join logic
      const result = await db
        .selectFrom("ProcessedValue as processedData")
        .leftJoin("ProcessedValueHasRawValue as dataLink", (join) =>
          join.onRef("processedData.processed_value_id", "=", "dataLink.processed_value_id")
        )
        .leftJoin("RawValue as sensorData", (join) =>
          join
            .onRef("sensorData.raw_value_id", "=", "dataLink.raw_value_id")
            .onRef("sensorData.deployment_id", "=", "dataLink.deployment_id")
            .onRef("sensorData.logger_id", "=", "dataLink.logger_id")
            .onRef("sensorData.sensor_id", "=", "dataLink.sensor_id")
        )
        .where("sensorData.deployment_id", "=", deployment_id)
        .innerJoin(sensorDataAggregation.as("aggregatedData"), (join) =>
          join
            .onRef("processedData.processing_time", "=", "aggregatedData.latest_processing_time")
            .onRef("dataLink.sensor_id", "=", "aggregatedData.sensor_id")
            .onRef("dataLink.raw_value_id", "=", "aggregatedData.raw_value_id")
        )
        .where("processedData.valid", "=", 1)
        .where("sensorData.deployment_id", "=", deployment_id)
        .innerJoin("Deployment", (join) =>
          join
            .onRef("Deployment.deployment_id", "=", "sensorData.deployment_id")
            .onRef("Deployment.logger_id", "=", "sensorData.logger_id")
        )
        .innerJoin("Sensor", "Sensor.sensor_id", "dataLink.sensor_id")
        .innerJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
        .where("Sensor.sensor_type_id", "=", sensor_type_id)
        .select([
          "SensorType.parameter",
          "processedData.value",
          "processedData.measuring_time",
          "processedData.processed_value_id",
          "processedData.pressure",
          "sensorData.sensor_id",
          "Deployment.deployment_id",
        ])
        .groupBy("processedData.processed_value_id")
        .execute();

      return result;
    } catch (error) {
      throw error === EmptyDatabaseResult ? error : new DatabaseError(405, "Database error occurred.", error);
    }
  }

  /**
   * Retrieves parameter data for a specific deployment.
   * @param {number} logger_id - The ID of the logger.
   * @param {number} deployment_id - The ID of the deployment.
   * @returns {Promise<any[]>} - A promise that resolves with the parameter data.
   * @throws {DatabaseError | EmptyDatabaseResult} - Throws an error if the database operation fails or no data is found.
   */
  async getParameterDataForDeployment(logger_id: number, deployment_id: number) {
    try {
      const sensors = await db
        .selectFrom("SensorType")
        .innerJoin("Sensor", "SensorType.sensor_type_id", "SensorType.sensor_type_id")
        .select("Sensor.sensor_id")
        .groupBy("Sensor.sensor_id")
        .execute();
      const sensor_ids = sensors.map((sensor) => sensor.sensor_id);

      const sensorDataAggregation = db
        .selectFrom("RawValue as rawValue")
        .leftJoin("ProcessedValueHasRawValue as linkTable", (join) =>
          join
            .onRef("rawValue.raw_value_id", "=", "linkTable.raw_value_id")
            .onRef("rawValue.deployment_id", "=", "linkTable.deployment_id")
            .onRef("rawValue.logger_id", "=", "linkTable.logger_id")
            .onRef("rawValue.sensor_id", "=", "linkTable.sensor_id")
        )
        .where("rawValue.logger_id", "=", logger_id)
        .where("rawValue.deployment_id", "=", deployment_id)
        .where("rawValue.sensor_id", "in", sensor_ids)
        .leftJoin(
          "ProcessedValue as processedValue",
          "linkTable.processed_value_id",
          "processedValue.processed_value_id"
        )
        .where("processedValue.valid", "=", 1)
        .where("rawValue.deployment_id", "=", deployment_id)
        .select([
          "processedValue.processed_value_id",
          "processedValue.measuring_time",
          sql`MAX(processedValue.processing_time)`.as("latest_processing_time"),
          "processedValue.pressure",
          "processedValue.value",
          "processedValue.position",
          "rawValue.sensor_id",
          "rawValue.raw_value_id",
          "rawValue.logger_id",
        ])
        .groupBy(["rawValue.sensor_id", "rawValue.raw_value_id", "rawValue.logger_id", "rawValue.deployment_id"]);

      // Main query with better naming and join logic
      const result = await db
        .selectFrom("ProcessedValue as processedData")
        .leftJoin("ProcessedValueHasRawValue as dataLink", (join) =>
          join.onRef("processedData.processed_value_id", "=", "dataLink.processed_value_id")
        )
        .innerJoin(sensorDataAggregation.as("aggregatedData"), (join) =>
          join
            .onRef("processedData.processing_time", "=", "aggregatedData.latest_processing_time")
            .onRef("dataLink.sensor_id", "=", "aggregatedData.sensor_id")
            .onRef("dataLink.raw_value_id", "=", "aggregatedData.raw_value_id")
        )
        .leftJoin("RawValue as sensorData", (join) =>
          join
            .onRef("sensorData.raw_value_id", "=", "dataLink.raw_value_id")
            .onRef("sensorData.deployment_id", "=", "dataLink.deployment_id")
            .onRef("sensorData.logger_id", "=", "dataLink.logger_id")
            .onRef("sensorData.sensor_id", "=", "dataLink.sensor_id")
        )
        .where("processedData.valid", "=", 1)
        .where("sensorData.deployment_id", "=", deployment_id)
        .innerJoin("Deployment", (join) =>
          join
            .onRef("Deployment.deployment_id", "=", "sensorData.deployment_id")
            .onRef("Deployment.logger_id", "=", "sensorData.logger_id")
        )
        .innerJoin("Sensor", "Sensor.sensor_id", "dataLink.sensor_id")
        .innerJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
        .leftJoin("Unit", "Unit.unit_id", "processedData.unit_id")
        .groupBy("SensorType.sensor_type_id")
        .select(({ fn }) => [
          "Deployment.deployment_id",
          "dataLink.processed_value_id",
          "SensorType.parameter",
          "SensorType.sensor_type_id",
          "sensorData.sensor_id",
          "Unit.unit",
          "Deployment.time_end",
          "Deployment.time_start",
          fn.max("processedData.value").as("value"),
        ])
        .having(({ fn, eb, ref }) => eb(ref("value"), "=", fn.max("processedData.value")))
        .execute();

      return result;
    } catch (error) {
      throw error === EmptyDatabaseResult ? error : new DatabaseError(405, "Database error occurred.", error);
    }
  }

  /**
   * Retrieves track data for a specific logger and deployment.
   * @param {number} logger_id - The ID of the logger.
   * @param {number} deployment_id - The ID of the deployment.
   * @returns {Promise<any[]>} - A promise that resolves with the track data.
   * @throws {DatabaseError | EmptyDatabaseResult} - Throws an error if the database operation fails or no data is found.
   */
  async getTrackDataByLoggerAndDeployment(logger_id: number, deployment_id: number) {
    try {
      const sensors = await db
        .selectFrom("SensorType")
        .innerJoin("Sensor", "SensorType.sensor_type_id", "SensorType.sensor_type_id")
        .select("Sensor.sensor_id")
        .groupBy("Sensor.sensor_id")
        .execute();
      const sensor_ids = sensors.map((sensor) => sensor.sensor_id);

      const sensorDataAggregation = db
        .selectFrom("RawValue as rawValue")
        .leftJoin("ProcessedValueHasRawValue as linkTable", (join) =>
          join
            .onRef("rawValue.raw_value_id", "=", "linkTable.raw_value_id")
            .onRef("rawValue.deployment_id", "=", "linkTable.deployment_id")
            .onRef("rawValue.logger_id", "=", "linkTable.logger_id")
            .onRef("rawValue.sensor_id", "=", "linkTable.sensor_id")
        )
        .where("rawValue.logger_id", "=", logger_id)
        .where("rawValue.deployment_id", "=", deployment_id)
        .where("rawValue.sensor_id", "in", sensor_ids)
        .innerJoin(
          "ProcessedValue as processedValue",
          "linkTable.processed_value_id",
          "processedValue.processed_value_id"
        )
        .where("processedValue.valid", "=", 1)
        .where("rawValue.deployment_id", "=", deployment_id)
        .select([
          "processedValue.processed_value_id",
          "processedValue.measuring_time",
          sql`MAX(processedValue.processing_time)`.as("latest_processing_time"),
          "processedValue.pressure",
          "processedValue.value",
          "processedValue.position",
          "rawValue.sensor_id",
          "rawValue.raw_value_id",
          "rawValue.logger_id",
        ])
        .groupBy(["rawValue.sensor_id", "rawValue.raw_value_id", "rawValue.logger_id", "rawValue.deployment_id"]);

      const result = await db
        .selectFrom("ProcessedValue as processedData")
        .leftJoin("ProcessedValueHasRawValue as dataLink", (join) =>
          join.onRef("processedData.processed_value_id", "=", "dataLink.processed_value_id")
        )
        .innerJoin(sensorDataAggregation.as("aggregatedData"), (join) =>
          join
            .onRef("processedData.processing_time", "=", "aggregatedData.latest_processing_time")
            .onRef("dataLink.sensor_id", "=", "aggregatedData.sensor_id")
            .onRef("dataLink.raw_value_id", "=", "aggregatedData.raw_value_id")
        )
        .leftJoin("RawValue as sensorData", (join) =>
          join
            .onRef("sensorData.raw_value_id", "=", "dataLink.raw_value_id")
            .onRef("sensorData.deployment_id", "=", "dataLink.deployment_id")
            .onRef("sensorData.logger_id", "=", "dataLink.logger_id")
            .onRef("sensorData.sensor_id", "=", "dataLink.sensor_id")
        )
        .where("processedData.valid", "=", 1)
        .where("sensorData.deployment_id", "=", deployment_id)
        .innerJoin("Deployment", (join) =>
          join
            .onRef("Deployment.deployment_id", "=", "sensorData.deployment_id")
            .onRef("Deployment.logger_id", "=", "sensorData.logger_id")
        )
        .innerJoin("Sensor", "Sensor.sensor_id", "sensorData.sensor_id")
        .innerJoin("SensorType", "Sensor.sensor_type_id", "SensorType.sensor_type_id")
        .where(sql`ST_AsText(processedData.position)`, "!=", "POINT(-999 -999)")
        .orderBy("processedData.processing_time", "desc")
        .groupBy("processedData.position")
        .select([
          "processedData.position",
          "processedData.measuring_time",
          "processedData.pressure",
          "sensorData.deployment_id",
        ])
        .execute();
      return result;
    } catch (error) {
      throw error === EmptyDatabaseResult ? error : new DatabaseError(405, "Database error occurred.", error);
    }
  }
}

/**
 * Type representing parameter data for a specific deployment.
 */
export type ParameterDataForDeployment = Awaited<
  ReturnType<ProcessedValueService["getParameterDataForDeployment"]>
>[number];

/**
 * Type representing diagram data for a specific parameter and deployment.
 */
export type DiagramDataForParameterAndDeployment = Awaited<
  ReturnType<ProcessedValueService["getDiagramDataForParameterAndDeployment"]>
>[number];

/**
 * Type representing track data for a specific logger and deployment.
 */
export type TrackData = Awaited<ReturnType<ProcessedValueService["getTrackDataByLoggerAndDeployment"]>>[number];
