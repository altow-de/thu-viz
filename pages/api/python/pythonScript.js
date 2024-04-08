import { spawn } from "child_process";

export default function handler(req, res) {
  const { measurements } = req.body;
  const path = process.env.PYTHON_FILE_PATH;

  const pythonProcess = spawn("python3", [path]);

  let stdoutData = "";
  let stderrData = "";

  pythonProcess.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`exec error: ${stderrData}`);
      return res.status(500).json({ message: `Serverfehler: ${stderrData}` });
    }
    try {
      const output = JSON.parse(stdoutData);
      res.status(200).json({ data: output });
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Parsen der Python-Ausgabe" });
    }
  });

  // Senden der Messwerte als JSON über stdin
  pythonProcess.stdin.write(JSON.stringify({ measurements }));
  pythonProcess.stdin.end();
}
