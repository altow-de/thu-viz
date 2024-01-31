import { Platform } from "@/backend/entities";
import { DatabaseError } from "@/backend/services/DatabaseError";
import { PlatformService } from "@/backend/services/PlatformService";
import type { NextApiRequest, NextApiResponse } from "next";

const platformService = new PlatformService();

/**
 * Handles the retrieval of all sensors.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Platform[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Platform[] | DatabaseError>) {
  try {
    const dpResponse = (await platformService.getAll()) as Platform[];
    res.status(200).json(dpResponse);
  } catch (error) {
    res.status(500).json(error as DatabaseError);
  }
}
