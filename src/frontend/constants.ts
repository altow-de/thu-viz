import { DatabaseError } from "@/backend/services/DatabaseError";
import { MeasurementAnkers, OverviewAnkers } from "./enum";
import { Anker } from "./types";

export const NavigationPage = ["Overview", "Measurement Data"];

export const MapStyles: { [key: string]: string } = { "basic-v2": "Street Map", satellite: "Satellite" };

export const LayerZoom = { minzoom: 0, maxzoom: 22 };

export const OverviewAnkerTitles: Anker[] = [
  { id: OverviewAnkers.MeasurementSelection, title: "Selection of measurement data" },
  { id: OverviewAnkers.OverviewDeployments, title: "Overview Deployment" },
  { id: OverviewAnkers.PositionOfDeployments, title: "Position of Deployments (Startposition)" },
];

export const MeasurementAnkerTitles: Anker[] = [
  { id: MeasurementAnkers.SelectionSingleDeployment, title: "Selection of single deployment" },
  { id: MeasurementAnkers.Metadata, title: "Metadata" },
  { id: MeasurementAnkers.ParameterOverTime, title: "Parameter over time" },
  { id: MeasurementAnkers.ParameterOverDepth, title: "Parameter over depths" },
  { id: MeasurementAnkers.Track, title: "Track" },
];

export const TableTitle = {
  deployment_id: "Deployment",
  logger_id: "Logger",
  platform_id: "Platform",
  date: "Date",
  depth: "max. Depth",
  duration: "Duration",
};

export const TableDataKeys = {
  time_start: "Time begin",
  time_end: "Time end",
  name: "Vessel",
  position_start: "Position start: lat, long",
  position_end: "Position end: lat, long",
};

export const DateTimeLocaleOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

export const EmptyDatabaseResult = new DatabaseError(406, "Database error occurred. Result is empty.", []);
