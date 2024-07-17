/**
 * Service class for calling Python scripts from the backend.
 */
export class PythonService {
  /**
   * Calls a Python script with the provided measurements.
   *
   * @param {any[]} measurements - The array of measurements to be processed by the Python script.
   * @returns {Promise<any>} - A promise that resolves to the result of the Python script execution.
   */
  async callPythonScript(measurements: any[]): Promise<any> {
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
