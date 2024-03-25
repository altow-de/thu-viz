import convert, { Time } from "convert";

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
