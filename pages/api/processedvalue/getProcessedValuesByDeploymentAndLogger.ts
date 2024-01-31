import { ProcessedValue } from "@/backend/entities";
import { DatabaseError } from "@/backend/services/DatabaseError";
import { ProcessedValueService, ProcessedValuesForDiagrams } from "@/backend/services/ProcessedValueService";

import type { NextApiRequest, NextApiResponse } from "next";

const rawValueService: ProcessedValueService = new ProcessedValueService();

/**
 * Handles the retrieval of all sensors.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<ProcessedValuesForDiagrams[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProcessedValuesForDiagrams[] | DatabaseError>
) {
  const logger_id = Number(req.query.logger_id);
  const deployment_id = Number(req.query.deployment_id);
  try {
    const dpResponse = await rawValueService.getProcessedValuesByDeploymentAndLogger(logger_id, deployment_id);
    res.status(200).json(dpResponse);
  } catch (error) {
    res.status(500).json(error as DatabaseError);
  }
}
