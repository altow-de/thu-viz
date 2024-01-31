import { Deployment } from "@/backend/entities";
import { DatabaseError } from "@/backend/services/DatabaseError";
import { DeploymentService } from "@/backend/services/DeploymentService";
import type { NextApiRequest, NextApiResponse } from "next";

const deploymentService = new DeploymentService();

/**
 * Handles the retrieval of all sensors.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Deployment[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Deployment[] | DatabaseError>) {
  const logger_id = Number(req.query.logger_id);

  try {
    const dpResponse = (await deploymentService.getDeploymentsByLogger(logger_id)) as Deployment[];
    res.status(200).json(dpResponse);
  } catch (error) {
    res.status(500).json(error as DatabaseError);
  }
}
