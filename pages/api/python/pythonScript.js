import { spawn } from "child_process";

/**
 * Handles the execution of a Python script with the provided measurements.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<{ data?: any, message?: string }>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default function handler(req, res) {
  const { measurements } = req.body;
  const path = process.env.PYTHON_FILE_PATH;

  const pythonProcess = spawn("python3", [path]);

  let stdoutData = "";
  let stderrData = "";

  // Collect stdout data from the Python script
  pythonProcess.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  // Collect stderr data from the Python script
  pythonProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  // Handle the close event of the Python process
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`exec error: ${stderrData}`);
      return res.status(500).json({ message: `Server error: ${stderrData}` });
    }
    try {
      const output = JSON.parse(stdoutData);
      res.status(200).json({ data: output });
    } catch (error) {
      res.status(500).json({ message: "Error parsing Python output" });
    }
  });

  // Send the measurements as JSON over stdin
  pythonProcess.stdin.write(JSON.stringify({ measurements }));
  pythonProcess.stdin.end();
}
