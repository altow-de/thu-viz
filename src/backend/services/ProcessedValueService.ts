import { EmptyDatabaseResult } from "@/frontend/constants";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { DatabaseError } from "./DatabaseError";

export class ProcessedValueService extends BackendDbService {
  constructor() {
    super("ProcessedValue");
  }

  async getProcessedValuesByDeploymentAndLogger(logger_id: number, deployment_id: number) {
    try {
      const rawValues = await db
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

      if (rawValues?.length > 0) {
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
          .select([
            "ProcessedValue.processed_value_id",
            "Deployment.deployment_id",
            "ProcessedValueHasRawValue.logger_id",
            "SensorType.parameter",
            "ProcessedValue.depth",
            "ProcessedValue.value",
            "ProcessedValue.position",
            "Unit.unit",
            "Deployment.time_start",
            "Deployment.time_end",
          ])
          .groupBy("ProcessedValue.processed_value_id")
          .execute();
        return result;
      } else {
        throw EmptyDatabaseResult;
      }
    } catch (error) {
      throw error === EmptyDatabaseResult ? error : new DatabaseError(405, "Database error occurred.", error);
    }
  }
}
export type ProcessedValuesForDiagrams = Awaited<
  ReturnType<ProcessedValueService["getProcessedValuesByDeploymentAndLogger"]>
>[number];
