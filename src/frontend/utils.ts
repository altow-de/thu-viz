import convert, { Time } from "convert";
import JSZip from "jszip";

/**
 * Extracts numbers from a given string.
 * @param str - The input string.
 * @returns A string of found numbers.
 */
export const getNumbersFromString = (str: string) => {
  const regex = /[-+]?[0-9]*\.?[0-9]+/g;
  const foundNumbers = str.match(regex);
  return foundNumbers?.toString();
};

/**
 * Extracts words (characters) from a given string.
 * @param str - The input string.
 * @returns A string of found words.
 */
export const getWordsFromString = (str: string) => {
  const regex = /\d+([a-zA-Z]+)/g;
  const matches = [];
  let match = null;
  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]);
  }
  return matches.toString();
};

/**
 * Converts a time string to megaseconds for sorting.
 * @param str - The input string containing time and unit.
 * @returns The time in megaseconds.
 */
export const getTimeObjectForSort = (str: string) => {
  const time = getNumbersFromString(str);
  const unit = getWordsFromString(str);
  const conv = convert(Number(time), unit as unknown as Time).to("megaseconds");
  return conv;
};

/**
 * Converts pressure to depth.
 * @param pressure - The pressure value.
 * @returns An object containing the depth value and its unit.
 */
export const getDepthFromPressure = (pressure: number) => {
  return { val: ((pressure - 1013) / 100).toFixed(1), unit: "m" };
};

/**
 * Validates if the given date is a valid Date object.
 * @param d - The date to validate.
 * @returns True if the date is valid, otherwise false.
 */
export const isValidDate = (d: Date | undefined) => {
  return d && d instanceof Date && !isNaN(d.getTime());
};

/**
 * Finds the longest array in an object.
 * @param obj - The object containing arrays.
 * @returns The longest array found.
 */
export const findLongestArray = (obj: any) => {
  let longestArray = []; // Initial state: empty array
  for (let key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length > longestArray.length) {
      // Check if it is an array and if it is longer than the current longest array
      longestArray = obj[key];
    }
  }
  return longestArray; // Return the longest array
};

/**
 * Finds the shortest array in an object.
 * @param obj - The object containing arrays.
 * @returns The shortest array found.
 */
export const findShortestArray = (obj: any) => {
  let shortestArray = obj[0]; // Initial state: first array
  for (let key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length < shortestArray.length && obj[key].length > 0) {
      // Check if it is an array and if it is shorter than the current shortest array
      shortestArray = obj[key];
    }
  }
  return shortestArray; // Return the shortest array
};

/**
 * Converts an SVG chart to PNG format.
 * @param chartId - The ID of the SVG element.
 * @param callback - The callback function to handle the result.
 */
export const convertChartToPNG = (
  chartId: string,
  callback: (result: { blob: Blob | null; filename: string }) => void
) => {
  const svgElement = document.getElementById(chartId);
  if (svgElement) {
    return svgToCanvas(svgElement, (result) => {
      callback(result); // Pass the result with Blob and filename
    });
  }
};

/**
 * Converts an SVG element to a canvas element.
 * @param svgElement - The SVG element.
 * @param callback - The callback function to handle the result.
 */
export const svgToCanvas = (
  svgElement: HTMLElement,
  callback: (result: { blob: Blob | null; filename: string }) => void
) => {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement("canvas");
  const scale = 3;

  // Resize can break shadows
  canvas.width = svgElement.clientWidth * scale;
  canvas.height = svgElement.clientHeight * scale;
  canvas.style.width = svgElement.clientWidth.toString();
  canvas.style.height = svgElement.clientHeight.toString();

  const ctxt = canvas.getContext("2d");
  if (ctxt) {
    ctxt.fillStyle = "white";
    ctxt.fillRect(0, 0, canvas.width, canvas.height);
    ctxt.scale(scale, scale);

    const img = document.createElement("img");

    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = () => {
      ctxt.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const filename = svgElement.id + ".png"; // Generate a dynamic filename if needed
        callback({ blob, filename });
      }, "image/png");
    };
  }
};

/**
 * Creates and downloads a ZIP file containing the provided blobs.
 * @param blobs - An array of objects containing blobs and filenames.
 */
export const createAndDownloadZip = (blobs: any[]) => {
  const zip = new JSZip();

  blobs.map((blob) => {
    zip.file(blob.filename, blob.blob); // Add the image blob to the zip
  });
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // Create a temporary link element to download the ZIP archive
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = "export.zip"; // The filename of the downloaded ZIP archive
    document.body.appendChild(downloadLink);
    downloadLink.click(); // Simulate a click on the link to start the download
    document.body.removeChild(downloadLink); // Remove the temporary link
  });
};

/**
 * Calculates the oxygen concentration from partial pressure.
 * @param pO2 - Partial pressure of oxygen.
 * @param T - Temperature in degrees Celsius.
 * @param S - Salinity in PSU.
 * @param P - Pressure in dbar (default is 0).
 * @returns The oxygen concentration in ml/L.
 */
export const o2ptoO2c = (pO2: number, T: number, S: number, P = 0) => {
  const xO2 = 0.20946; // Mole fraction of O2 in dry air
  const pH2Osat =
    1013.25 * Math.exp(24.4543 - 67.4509 * (100 / (T + 273.15)) - 4.8489 * Math.log((273.15 + T) / 100) - 0.000544 * S);
  const sca_T = Math.log((298.15 - T) / (273.15 + T));
  const TCorr =
    44.6596 *
    Math.exp(
      2.00907 +
        3.22014 * sca_T +
        4.0501 * Math.pow(sca_T, 2) +
        4.94457 * Math.pow(sca_T, 3) -
        2.56847e-1 * Math.pow(sca_T, 4) +
        3.88767 * Math.pow(sca_T, 5)
    );

  const Scorr = Math.exp(
    S * (-6.24523e-3 - 7.37614e-3 * sca_T - 1.0341e-2 * Math.pow(sca_T, 2) - 8.17083e-3 * Math.pow(sca_T, 3)) -
      4.88682e-7 * S * S
  );
  const Vm = 0.317; // Molar volume of O2 in m3 mol-1 Pa dbar-1
  const R = 8.314; // Universal gas constant in J mol-1 K-1

  const O2conc_umolL =
    ((pO2 / (xO2 * (1013.25 - pH2Osat))) * (TCorr * Scorr)) / Math.exp((Vm * P) / (R * (T + 273.15)));

  const O2conc_mlL = O2conc_umolL / 44.6596;

  return O2conc_mlL;
};
