import convert, { Time } from "convert";
import JSZip from "jszip";

export const getNumbersFromString = (str: string) => {
  const regex = /[-+]?[0-9]*\.?[0-9]+/g;
  const foundNumbers = str.match(regex);
  return foundNumbers?.toString();
};

export const getWordsFromString = (str: string) => {
  const regex = /\d+([a-zA-Z]+)/g;
  const matches = [];
  let match = null;
  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]);
  }
  return matches.toString();
};

export const getTimeObjectForSort = (str: string) => {
  const time = getNumbersFromString(str);
  const unit = getWordsFromString(str);
  const conv = convert(Number(time), unit as unknown as Time).to("megaseconds");
  return conv;
};

export const getDepthFromPressure = (pressure: number) => {
  return { val: ((pressure - 1013) / 100).toFixed(1), unit: "m" };
};

export const isValidDate = (d: Date | undefined) => {
  return d && d instanceof Date && !isNaN(d.getTime());
};

export const findLongestArray = (obj: any) => {
  let longestArray = []; // Anfangszustand: leeres Array
  for (let key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length > longestArray.length) {
      // Prüfen, ob es ein Array ist und ob es länger als das bisher längste Array ist
      longestArray = obj[key];
    }
  }

  return longestArray; // Das längste Array zurückgeben
};

export const findShortestArray = (obj: any) => {
  let shortestArray = obj[0]; // Anfangszustand: leeres Array
  for (let key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length < shortestArray.length && obj[key].length > 0) {
      // Prüfen, ob es ein Array ist und ob es länger als das bisher längste Array ist
      shortestArray = obj[key];
    }
  }

  return shortestArray; // Das längste Array zurückgeben
};

export const convertChartToPNG = (
  chartId: string,
  callback: (result: { blob: Blob | null; filename: string }) => void
) => {
  const svgElement = document.getElementById(chartId);
  if (svgElement) {
    return svgToCanvas(svgElement, (result) => {
      callback(result); // Übergeben Sie das Ergebnis mit Blob und Dateinamen
    });
  }
};
export const svgToCanvas = (
  svgElement: HTMLElement,
  callback: (result: { blob: Blob | null; filename: string }) => void
) => {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement("canvas");

  //Resize can break shadows
  canvas.width = svgElement.clientWidth;
  canvas.height = svgElement.clientHeight;
  canvas.style.width = svgElement.clientWidth.toString();
  canvas.style.height = svgElement.clientHeight.toString();

  const ctxt = canvas.getContext("2d");
  if (ctxt) {
    ctxt.fillStyle = "white";
    ctxt.fillRect(0, 0, canvas.width, canvas.height);

    const img = document.createElement("img");

    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = () => {
      ctxt.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const filename = svgElement.id + ".png"; // Oder generieren Sie einen dynamischen Namen nach Bedarf
        callback({ blob, filename });
      }, "image/png");
    };
  }
};
export const createAndDownloadZip = (blobs: any[]) => {
  const zip = new JSZip();

  blobs.map((blob, index) => {
    zip.file(blob.filename, blob.blob); // Fügen Sie das Bild-Blob als map.png hinzu
  });
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // Erstellen eines temporären Link-Elements zum Herunterladen des ZIP-Archivs
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = "export.zip"; // Der Dateiname des heruntergeladenen ZIP-Archivs
    document.body.appendChild(downloadLink);
    downloadLink.click(); // Simuliert einen Klick auf den Link zum Starten des Downloads
    document.body.removeChild(downloadLink); // Entfernt den temporären Link
  });
};

export const o2ptoO2c = (pO2: number, T: number, S: number, P = 0) => {
  const xO2 = 0.20946; // mole fraction of O2 in dry air
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
  const Vm = 0.317; // molar volume of O2 in m3 mol-1 Pa dbar-1
  const R = 8.314; // universal gas constant in J mol-1 K-1

  const O2conc_umolL =
    ((pO2 / (xO2 * (1013.25 - pH2Osat))) * (TCorr * Scorr)) / Math.exp((Vm * P) / (R * (T + 273.15)));

  const O2conc_mlL = O2conc_umolL / 44.6596;

  return O2conc_mlL;
};
