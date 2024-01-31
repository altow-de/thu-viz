import { DatabaseError } from "@/backend/services/DatabaseError";
import { DeploymentService } from "@/backend/services/DeploymentService";
import { DeploymentTableData } from "@/frontend/types";
import type { NextApiRequest, NextApiResponse } from "next";

const deploymentService = new DeploymentService();

/**
 * Handles the retrieval of all sensors.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<DeploymentTableData>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<DeploymentTableData | DatabaseError>) {
  const logger_id = Number(req.query.logger_id);
  const deployment_id = Number(req.query.deployment_id);

  try {
    const dpResponse = (await deploymentService.getDeploymentById(logger_id, deployment_id)) as DeploymentTableData;
    res.status(200).json(dpResponse);
  } catch (error) {
    res.status(400).json(error as DatabaseError);
  }
}
