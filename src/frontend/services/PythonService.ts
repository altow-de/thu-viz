export class PythonService {
  async callPythonScript(measurements: any[]) {
    const res = await fetch("/api/python/pythonScript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ measurements }),
    });
    return await res.json();
  }
}
