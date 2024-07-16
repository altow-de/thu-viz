import { sql } from "kysely";
import { db } from "../db";
import { BackendDbService } from "./BackendDbService";
import { Region } from "@/frontend/types";
import { format } from "date-fns";
import { isValidDate } from "@/frontend/utils";

/**
 * Service class for handling deployment-related operations.
 */
export class DeploymentService extends BackendDbService {
  constructor() {
    super("Deployment");
  }

  /**
   * Retrieves deployment data based on time range, platform ID, and region.
   * @param {Date} [time_start] - The start time for the query.
   * @param {Date} [time_end] - The end time for the query.
   * @param {number} [platform_id] - The ID of the platform.
   * @param {Region} [region] - The region for the query.
   * @returns {Promise<any[]>} - A promise that resolves with the list of deployments.
   */
  async getOverviewDeploymentDataByTimePlatformAndRegion(
    time_start?: Date,
    time_end?: Date,
    platform_id?: number,
    region?: Region
  ) {
    let logger_ids: number[] = [];

    if (platform_id && Number(platform_id) > -1) {
      const logger = await db
        .selectFrom("PlatformContainsLogger")
        .where("PlatformContainsLogger.platform_id", "=", platform_id)
        .select("PlatformContainsLogger.logger_id")
        .groupBy("PlatformContainsLogger.logger_id")
        .execute();

      logger_ids = logger.map((logger) => logger.logger_id);
    }

    const sensorDataAggregation = db
      .selectFrom("RawValue as rawValue")
      .leftJoin("ProcessedValueHasRawValue as linkTable", (join) =>
        join
          .onRef("rawValue.raw_value_id", "=", "linkTable.raw_value_id")
          .onRef("rawValue.deployment_id", "=", "linkTable.deployment_id")
          .onRef("rawValue.logger_id", "=", "linkTable.logger_id")
          .onRef("rawValue.sensor_id", "=", "linkTable.sensor_id")
      )
      .leftJoin("ProcessedValue as processedValue", "linkTable.processed_value_id", "processedValue.processed_value_id")
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
    let query = db
      .selectFrom("ProcessedValue as processedData")
      .leftJoin("ProcessedValueHasRawValue as dataLink", (join) =>
        join.onRef("processedData.processed_value_id", "=", "dataLink.processed_value_id")
      )
      .leftJoin(sensorDataAggregation.as("aggregatedData"), (join) =>
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
      .where(sql`ST_AsText(sensorData.measuring_location)`, "!=", "POINT(-999 -999)")
      .leftJoin("PlatformContainsLogger", "sensorData.logger_id", "PlatformContainsLogger.logger_id")
      .leftJoin("Platform", "Platform.platform_id", "PlatformContainsLogger.platform_id")
      .leftJoin("Vessel", "Platform.platform_id", "Vessel.platform_id")
      .leftJoin("Deployment", (join) =>
        join
          .onRef("Deployment.deployment_id", "=", "sensorData.deployment_id")
          .onRef("Deployment.logger_id", "=", "sensorData.logger_id")
      )
      .select([
        "processedData.measuring_time",
        "processedData.value",
        "processedData.position",
        "sensorData.sensor_id",
        "sensorData.raw_value_id",
        "processedData.unit_id",
        "Deployment.deployment_id",
        "Deployment.logger_id",
        "Vessel.name",
        sql`MAX(sensorData.pressure)`.as("deepest"),
        "Deployment.time_start",
        "Deployment.time_end",
      ])
      .groupBy(["sensorData.logger_id", "sensorData.deployment_id"]);

    if (isValidDate(time_start) || isValidDate(time_end) || logger_ids?.length > 0 || region !== undefined) {
      query = query.where((eb: any) => {
        const conditions = [];

        if (isValidDate(time_start)) {
          const formattedStartDate = format(time_start as Date, "yyyy-MM-dd HH:mm:ss");
          conditions.push(eb("Deployment.time_start", ">=", formattedStartDate as unknown as Date));
        }
        if (isValidDate(time_end)) {
          const formattedEndDate = format(time_end as Date, "yyyy-MM-dd HH:mm:ss");
          conditions.push(eb("Deployment.time_end", "<=", formattedEndDate as unknown as Date));
        }
        if (logger_ids?.length > 0) {
          conditions.push(eb("Deployment.logger_id", "in", logger_ids));
        }

        if (region) {
          const polygon = region.polygon.toString();
          conditions.push(eb(sql`ST_Contains(ST_GeomFromText(${polygon}), Deployment.position_start)`, "=", true));
        }
        return conditions.length > 0 ? eb.and(conditions) : eb;
      });
    }
    const result = query.limit(2000).execute();
    return result;
  }

  /**
   * Retrieves deployments for a specific logger.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<any[]>} - A promise that resolves with the list of deployments.
   */
  async getDeploymentsByLogger(logger_id: number) {
    const result = await db
      .selectFrom("Deployment")
      .where(({ exists, selectFrom }) =>
        exists(
          selectFrom("ProcessedValueHasRawValue")
            .select("ProcessedValueHasRawValue.deployment_id")
            .whereRef("ProcessedValueHasRawValue.deployment_id", "=", "Deployment.deployment_id")
            .where("ProcessedValueHasRawValue.logger_id", "=", logger_id)
        )
      )
      .selectAll()
      .groupBy(["Deployment.deployment_id"])
      .execute();
    return result;
  }

  /**
   * Retrieves a specific deployment by logger ID and deployment ID.
   * @param {number} logger_id - The ID of the logger.
   * @param {number} deployment_id - The ID of the deployment.
   * @returns {Promise<any>} - A promise that resolves with the deployment details.
   */
  async getDeploymentById(logger_id: number, deployment_id: number) {
    const result = await db
      .selectFrom("Deployment")
      .where(({ eb, and }) =>
        and([eb("Deployment.logger_id", "=", logger_id), eb("Deployment.deployment_id", "=", deployment_id)])
      )
      .innerJoin("PlatformContainsLogger", "PlatformContainsLogger.logger_id", "Deployment.logger_id")
      .innerJoin("Vessel", "Vessel.platform_id", "PlatformContainsLogger.platform_id")
      .select([
        "Deployment.time_start",
        "Deployment.time_end",
        "Deployment.position_start",
        "Deployment.position_end",
        "Vessel.name",
      ])
      .executeTakeFirst();
    return result;
  }
}
