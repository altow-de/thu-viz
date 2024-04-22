import { EmptyDatabaseResult } from "@/frontend/constants";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { DatabaseError } from "./DatabaseError";
import { ProcessedValueHasRawValue } from "../entities";
import { sql } from "kysely";

export class ProcessedValueService extends BackendDbService {
  constructor() {
    super("ProcessedValue");
  }

  private async getRawValues(logger_id: number, deployment_id: number) {
    return await db
      .selectFrom("ProcessedValueHasRawValue")
      .where((eb) =>
        eb.and({
          deployment_id: deployment_id,
          logger_id: logger_id,
        })
      )
      .selectAll()
      .execute();
  }

  private async getValidRawValues(rawValues: ProcessedValueHasRawValue[]): Promise<any> {
    const rawValueIds = rawValues.map((obj) => obj.processed_value_id);
    if (rawValueIds.length === 0) return undefined;

    //Define the subquery to determine the latest processing_time for each raw_value_id
    const latestProcessingTimesSubquery = db
      .selectFrom("ProcessedValueHasRawValue")
      .innerJoin("Sensor", "Sensor.sensor_id", "ProcessedValueHasRawValue.sensor_id")
      .innerJoin("SensorType", "Sensor.sensor_type_id", "Sensor.sensor_type_id")
      .innerJoin("ProcessedValue", "ProcessedValue.processed_value_id", "ProcessedValueHasRawValue.processed_value_id")
      .select(["ProcessedValueHasRawValue.raw_value_id", "SensorType.parameter"])
      .select(sql`MAX(ProcessedValue.processing_time)`.as("latest_processing_time"))
      .where("ProcessedValueHasRawValue.processed_value_id", "in", rawValueIds)
      .where("ProcessedValue.valid", "=", 1)
      .groupBy("ProcessedValueHasRawValue.raw_value_id")
      .as("lpt");

    // Execute the main query to retrieve the latest valid ProcessedValue entries.
    const result = await db
      .selectFrom("ProcessedValue")
      .innerJoin(
        "ProcessedValueHasRawValue",
        "ProcessedValueHasRawValue.processed_value_id",
        "ProcessedValue.processed_value_id"
      )
      .innerJoin(latestProcessingTimesSubquery, (join) =>
        join
          .onRef("lpt.raw_value_id", "=", "ProcessedValueHasRawValue.raw_value_id")
          .on(sql`ProcessedValue.processing_time = lpt.latest_processing_time`)
      )

      .where("ProcessedValue.valid", "=", 1)
      .select([
        "ProcessedValueHasRawValue.raw_value_id",
        "ProcessedValue.processing_time",
        "lpt.raw_value_id",
        "lpt.latest_processing_time",
        "ProcessedValueHasRawValue.processed_value_id",
        "ProcessedValueHasRawValue.deployment_id",
        "ProcessedValue.value",
      ])
      .execute();

    return result;
  }

  async getDiagramDataForParameterAndDeployment(logger_id: number, deployment_id: number, parameter: string) {
    try {
      // First retrieve sensor IDs associated with the parameter to optimize the query execution speed.
      const sensors = await db
        .selectFrom("SensorType")
        .innerJoin("Sensor", "SensorType.sensor_type_id", "SensorType.sensor_type_id")
        .where("SensorType.parameter", "=", parameter)
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
        .innerJoin(sensorDataAggregation.as("aggregatedData"), (join) =>
          join
            .onRef("processedData.processing_time", "=", "aggregatedData.latest_processing_time")
            .onRef("dataLink.sensor_id", "=", "aggregatedData.sensor_id")
            .onRef("dataLink.raw_value_id", "=", "aggregatedData.raw_value_id")
        )
        .where("processedData.valid", "=", 1)
        .innerJoin("Deployment", (join) =>
          join
            .onRef("Deployment.deployment_id", "=", "sensorData.deployment_id")
            .onRef("Deployment.logger_id", "=", "sensorData.logger_id")
        )
        .innerJoin("Sensor", "Sensor.sensor_id", "dataLink.sensor_id")
        .innerJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
        .where("SensorType.parameter", "=", parameter)
        .select([
          "SensorType.parameter",
          "processedData.value",
          "processedData.measuring_time",
          "processedData.processed_value_id",
          "processedData.pressure",
        ])
        .groupBy("processedData.processed_value_id")
        .execute();

      return result;
    } catch (error) {
      throw error === EmptyDatabaseResult ? error : new DatabaseError(405, "Database error occurred.", error);
    }
  }

  async getParameterDataForDeployment(logger_id: number, deployment_id: number) {
    try {
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
        .leftJoin(
          "ProcessedValue as processedValue",
          "linkTable.processed_value_id",
          "processedValue.processed_value_id"
        )
        .where("processedValue.valid", "=", 1)
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
        .innerJoin("Deployment", (join) =>
          join
            .onRef("Deployment.deployment_id", "=", "sensorData.deployment_id")
            .onRef("Deployment.logger_id", "=", "sensorData.logger_id")
        )
        .innerJoin("Sensor", "Sensor.sensor_id", "dataLink.sensor_id")
        .innerJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
        .innerJoin("Unit", "Unit.unit_id", "SensorType.unit_id")
        .groupBy("SensorType.parameter")
        .select(({ fn }) => [
          "Deployment.deployment_id",
          "dataLink.processed_value_id",
          "SensorType.parameter",
          "SensorType.sensor_type_id",
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

  async getTrackDataByLoggerAndDeployment(logger_id: number, deployment_id: number) {
    try {
      const rawValues = await this.getRawValues(logger_id, deployment_id);
      const validRawValues = await this.getValidRawValues(rawValues);

      if (!rawValues || !validRawValues) {
        throw EmptyDatabaseResult;
      }
      const validRawValueIDs = validRawValues.map((rawValue: any) => rawValue.processed_value_id);

      const res = db
        .selectFrom("ProcessedValueHasRawValue")
        .where("ProcessedValueHasRawValue.processed_value_id", "in", validRawValueIDs)
        .innerJoin(
          "ProcessedValue",
          "ProcessedValue.processed_value_id",
          "ProcessedValueHasRawValue.processed_value_id"
        )
        .innerJoin("Sensor", "Sensor.sensor_id", "ProcessedValueHasRawValue.sensor_id")
        .innerJoin("SensorType", "Sensor.sensor_type_id", "SensorType.sensor_type_id")
        .where(sql`ST_AsText(ProcessedValue.position)`, "!=", "POINT(-999 -999)")
        .selectAll()
        .orderBy("ProcessedValue.processing_time", "desc")
        .groupBy("ProcessedValue.position")
        .execute();
      return res;
    } catch (error) {
      throw error === EmptyDatabaseResult ? error : new DatabaseError(405, "Database error occurred.", error);
    }
  }
}

export type ParameterDataForDeployment = Awaited<
  ReturnType<ProcessedValueService["getParameterDataForDeployment"]>
>[number];

export type DiagramDataForParameterAndDeployment = Awaited<
  ReturnType<ProcessedValueService["getDiagramDataForParameterAndDeployment"]>
>[number];

export type TrackData = Awaited<ReturnType<ProcessedValueService["getTrackDataByLoggerAndDeployment"]>>[number];
