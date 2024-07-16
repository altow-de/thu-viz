import { DatabaseError } from "@/backend/services/DatabaseError";
import { DiagramDataForParameterAndDeployment, ProcessedValueService } from "@/backend/services/ProcessedValueService";

import type { NextApiRequest, NextApiResponse } from "next";

const rawValueService: ProcessedValueService = new ProcessedValueService();

/**
 * Handles the retrieval of all sensors.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<DiagramDataForParameterAndDeployment[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiagramDataForParameterAndDeployment[] | DatabaseError>
) {
  const logger_id = Number(req.query.logger_id);
  const deployment_id = Number(req.query.deployment_id);
  const sensor_type_id = Number(req.query.sensor_type_id);
  try {
    const dpResponse = await rawValueService.getDiagramDataForParameterAndDeployment(
      logger_id,
      deployment_id,
      sensor_type_id
    );
    res.status(200).json(dpResponse);
  } catch (error) {
    res.status(500).json(error as DatabaseError);
  }
}
