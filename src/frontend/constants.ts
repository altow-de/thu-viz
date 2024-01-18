import { MeasurementAnkers, OverviewAnkers } from "./enum";
import { Anker } from "./types";

export const NavigationPage = ["Overview", "Measurement Data"];

export const MapStyles: { [key: string]: string } = { "basic-v2": "Street Map", satellite: "Satellite" };

export const LayerZoom = { minzoom: 0, maxzoom: 22 };

export const OverviewAnkerTitles: Anker[] = [
  { id: OverviewAnkers.MeasurementSelection, title: "Selection" },
  { id: OverviewAnkers.OverviewDeployments, title: "Deployments" },
  { id: OverviewAnkers.PositionOfDeployments, title: "Map" },
];

export const MeasurementAnkerTitles: Anker[] = [
  { id: MeasurementAnkers.SelectionSingleDeployment, title: "Selection" },
  { id: MeasurementAnkers.Metadata, title: "Metadata" },
  { id: MeasurementAnkers.ParameterOverTime, title: "Diagrams time" },
  { id: MeasurementAnkers.ParameterOverDepth, title: "Diagrams depths" },
  { id: MeasurementAnkers.Track, title: "Track" },
];

export const testData = ["title 1", "title 2", "title 3", "title 4", "title 5"];
