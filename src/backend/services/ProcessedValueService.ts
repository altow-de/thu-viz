import { EmptyDatabaseResult } from "@/frontend/constants";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { DatabaseError } from "./DatabaseError";

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
      .leftJoin("Sensor", "Sensor.sensor_id", "ProcessedValueHasRawValue.sensor_id")
      .leftJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
      .selectAll()
      .execute();
  }

  async getDiagramDataForParameterAndDeployment(logger_id: number, deployment_id: number, parameter: string) {
    try {
      const rawValues = await this.getRawValues(logger_id, deployment_id);
      if (!rawValues) {
        throw EmptyDatabaseResult;
      }

      const result = await db
        .selectFrom("ProcessedValue")
        .where(
          "ProcessedValue.processed_value_id",
          "in",
          rawValues.map((obj) => obj.processed_value_id)
        )
        .where("ProcessedValue.valid", "=", 1)
        .leftJoin(
          "ProcessedValueHasRawValue",
          "ProcessedValue.processed_value_id",
          "ProcessedValueHasRawValue.processed_value_id"
        )
        .leftJoin("Deployment", "Deployment.deployment_id", "ProcessedValueHasRawValue.deployment_id")
        .leftJoin("Sensor", "Sensor.sensor_id", "ProcessedValueHasRawValue.sensor_id")
        .leftJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
        .where("SensorType.parameter", "=", parameter)
        .select(({ fn }) => [
          "SensorType.parameter",
          "Deployment.time_end",
          "Deployment.time_start",
          "ProcessedValue.value",
        ])
        .execute();

      return result;
    } catch (error) {
      throw error === EmptyDatabaseResult ? error : new DatabaseError(405, "Database error occurred.", error);
    }
  }

  async getParameterDataForDeployment(logger_id: number, deployment_id: number) {
    try {
      const rawValues = await this.getRawValues(logger_id, deployment_id);
      if (!rawValues) {
        throw EmptyDatabaseResult;
      }
      const result = await db
        .selectFrom("ProcessedValue")
        .where(
          "ProcessedValue.processed_value_id",
          "in",
          rawValues.map((obj) => obj.processed_value_id)
        )
        .where("ProcessedValue.valid", "=", 1)
        .leftJoin(
          "ProcessedValueHasRawValue",
          "ProcessedValue.processed_value_id",
          "ProcessedValueHasRawValue.processed_value_id"
        )
        .leftJoin("Deployment", "Deployment.deployment_id", "ProcessedValueHasRawValue.deployment_id")
        .leftJoin("Sensor", "Sensor.sensor_id", "ProcessedValueHasRawValue.sensor_id")
        .leftJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
        .leftJoin("Unit", "Unit.unit_id", "SensorType.unit_id")
        .groupBy("SensorType.parameter")
        .select(({ fn }) => [
          "Deployment.deployment_id",
          "ProcessedValueHasRawValue.processed_value_id",
          "SensorType.parameter",
          "SensorType.sensor_type_id",
          "Unit.unit",
          "Deployment.time_end",
          "Deployment.time_start",
          fn.max("ProcessedValue.value").as("value"),
        ])
        .having(({ fn, eb, ref }) => eb(ref("value"), "=", fn.max("ProcessedValue.value")))
        .execute();

      return result;
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
