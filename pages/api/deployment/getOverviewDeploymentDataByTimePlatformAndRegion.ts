import { NextApiRequest, NextApiResponse } from "next";
import { DatabaseError } from "@/backend/services/DatabaseError";
import { DeploymentService } from "@/backend/services/DeploymentService";
import { OverviewDeploymentTrackData, Region } from "@/frontend/types";

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
  // Stellen Sie sicher, dass nur POST-Anfragen akzeptiert werden

  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { platform_id, region, time_start, time_end } = req.body;

    const platformId = platform_id !== undefined && platform_id > -1 ? Number(platform_id) : undefined;

    const dpResponse = await deploymentService.getOverviewDeploymentDataByTimePlatformAndRegion(
      new Date(time_start),
      new Date(time_end),
      platformId,
      region as Region
    );

    res.status(200).json(dpResponse as unknown as OverviewDeploymentTrackData[]);
  } catch (error) {
    res.status(500).json(error as DatabaseError);
  }
}
