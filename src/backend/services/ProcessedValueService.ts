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
    const rawValueIds = rawValues.map((obj) => obj.raw_value_id);

    //Define the subquery to determine the latest processing_time for each raw_value_id
    const latestProcessingTimesSubquery = db
      .selectFrom("ProcessedValueHasRawValue")
      .innerJoin("ProcessedValue", "ProcessedValue.processed_value_id", "ProcessedValueHasRawValue.processed_value_id")
      .select("ProcessedValueHasRawValue.raw_value_id")
      .select(sql`MAX(ProcessedValue.processing_time)`.as("latest_processing_time"))
      .where("ProcessedValueHasRawValue.raw_value_id", "in", rawValueIds)
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
        join.onRef("lpt.raw_value_id", "=", "ProcessedValueHasRawValue.raw_value_id")
      )
      .where(({ ref, eb }) => eb("ProcessedValue.processing_time", "=", ref("lpt.latest_processing_time")))
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
      const rawValues = await this.getRawValues(logger_id, deployment_id);
      if (!rawValues) {
        throw EmptyDatabaseResult;
      }
      const validRawValues = await this.getValidRawValues(rawValues);
      const validRawValueIDs = validRawValues.map((rawValue: any) => rawValue.processed_value_id);

      const result = await db
        .selectFrom("ProcessedValueHasRawValue")
        .where("ProcessedValueHasRawValue.processed_value_id", "in", validRawValueIDs)
        .innerJoin(
          "ProcessedValue",
          "ProcessedValue.processed_value_id",
          "ProcessedValueHasRawValue.processed_value_id"
        )
        .innerJoin("Deployment", "Deployment.deployment_id", "ProcessedValueHasRawValue.deployment_id")
        .innerJoin("Sensor", "Sensor.sensor_id", "ProcessedValueHasRawValue.sensor_id")
        .innerJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
        .where("SensorType.parameter", "=", parameter)
        .select([
          "SensorType.parameter",
          "ProcessedValue.value",
          "ProcessedValue.processing_time",
          "ProcessedValue.processed_value_id",
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
        .select(({ fn }) => [fn.max("ProcessedValue.processing_time").as("processing_time")])
        .where("ProcessedValue.valid", "=", 1)
        .having(({ fn, eb, ref }) => eb(ref("processing_time"), "=", fn.max("ProcessedValue.processing_time")))
        .leftJoin(
          "ProcessedValueHasRawValue",
          "ProcessedValue.processed_value_id",
          "ProcessedValueHasRawValue.processed_value_id"
        )
        .innerJoin("Deployment", "Deployment.deployment_id", "ProcessedValueHasRawValue.deployment_id")
        .innerJoin("Sensor", "Sensor.sensor_id", "ProcessedValueHasRawValue.sensor_id")
        .innerJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
        .innerJoin("Unit", "Unit.unit_id", "SensorType.unit_id")
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
