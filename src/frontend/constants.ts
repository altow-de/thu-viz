import { Anker } from "./types";

export const NavigationPage = ["Overview", "Measurement Data"];

export const MapStyles: { [key: string]: string } = { "basic-v2": "Street Map", satellite: "Satellite" };

export const LayerZoom = { minzoom: 0, maxzoom: 22 };

export const OverviewAnkers: Anker[] = [
  { id: "measurement-selection", title: "Measurement Selection" },
  { id: "overview-deployments", title: "Overview Deployments" },
  { id: "position-of-deployments", title: "Deployment Positions" },
];
