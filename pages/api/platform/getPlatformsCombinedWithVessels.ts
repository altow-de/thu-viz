import { DatabaseError } from "@/backend/services/DatabaseError";
import { PlatformsCombinedWithVessels, PlatformService } from "@/backend/services/PlatformService";
import type { NextApiRequest, NextApiResponse } from "next";

const platformService = new PlatformService();

/**
 * Handles the retrieval of all sensors.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<PlatformsCombinedWithVessels[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlatformsCombinedWithVessels[] | DatabaseError>
) {
  try {
    const dpResponse = await platformService.getPlatformsCombinedWithVessels();
    res.status(200).json(dpResponse);
  } catch (error) {
    res.status(500).json(error as DatabaseError);
  }
}
