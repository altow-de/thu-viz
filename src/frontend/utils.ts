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
