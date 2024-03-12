import { DatabaseError } from "@/backend/services/DatabaseError";
import { DeploymentService, OverviewDeploymentTrackData } from "@/backend/services/DeploymentService";
import { Region } from "@/frontend/types";
import type { NextApiRequest, NextApiResponse } from "next";

const deploymentService = new DeploymentService();

/**
 * Handles the retrieval of all sensors.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<OverviewDeploymentTrackData[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OverviewDeploymentTrackData[] | DatabaseError>
) {
  const platform_id = Number(req.query.platform_id);
  const region = req.query.region as unknown as Region;

  const time_start = req.query.time_start as unknown as Date;
  const time_end = req.query.time_end as unknown as Date;

  try {
    const dpResponse = await deploymentService.getOverviewDeploymentDataByTimePlatformAndRegion(
      time_start,
      time_end,
      platform_id,
      region
    );
    res.status(200).json(dpResponse);
  } catch (error) {
    res.status(500).json(error as DatabaseError);
  }
}
