import { Logger } from "@/backend/entities";
import { LoggerService } from "@/backend/services/LoggerService";
import type { NextApiRequest, NextApiResponse } from "next";

const loggerService = new LoggerService();

/**
 * Handles the retrieval of all sensors.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Sensor[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Logger[]>) {
  const dpResponse = (await loggerService.getAll()) as Logger[];
  res.status(200).json(dpResponse);
}
