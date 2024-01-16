import { Anker } from "./types";

export const NavigationPage = ["Overview", "Measurement Data"];

export const MapStyles: { [key: string]: string } = { "basic-v2": "Street Map", satellite: "Satellite" };

export const LayerZoom = { minzoom: 0, maxzoom: 22 };

export const OverviewAnkers: Anker[] = [
  { id: "measurement-selection", title: "Selection" },
  { id: "overview-deployments", title: "Deployments" },
  { id: "position-of-deployments", title: "Map" },
];

export const MeasurementAnkers: Anker[] = [
  { id: "selection-single-deployment", title: "Selection" },
  { id: "metadata", title: "Metadata" },
  { id: "parameter-over-time", title: "Diagrams time" },
  { id: "parameter-over-depth", title: "Diagrams depths" },
  { id: "track", title: "Track" },
];
