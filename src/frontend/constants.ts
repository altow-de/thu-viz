import { DatabaseError } from "@/backend/services/DatabaseError";
import { MeasurementAnkers, OverviewAnkers } from "./enum";
import { Anker } from "./types";

export const NavigationPage = ["Overview", "Measurement Data"];

export const MapStyles: { [key: string]: string } = {
  "basic-v2": "Street Map",
  satellite: "Satellite",
};

export const LayerZoom = { minzoom: 0, maxzoom: 22 };

export const OverviewAnkerTitles: Anker[] = [
  {
    id: OverviewAnkers.MeasurementSelection,
    title: "Selection of measurement data",
  },
  { id: OverviewAnkers.OverviewDeployments, title: "Overview of selected measurement data" },
  {
    id: OverviewAnkers.PositionOfDeployments,
    title: "Measurement locations (start positions of deployments)",
  },
];

export const MeasurementAnkerTitles: Anker[] = [
  {
    id: MeasurementAnkers.SelectionSingleDeployment,
    title: "Selection of single deployment",
  },
  { id: MeasurementAnkers.Metadata, title: "Metadata" },
  { id: MeasurementAnkers.ParameterOverTime, title: "Parameter over time" },
  { id: MeasurementAnkers.ParameterOverDepth, title: "Parameter over depths" },
  { id: MeasurementAnkers.Track, title: "Track" },
];

export const TableTitle = {
  deployment_id: "Deployment",
  logger_id: "Logger",
  name: "Platform",
  time_start: "Date",
  deepest: "max. Depth",
  time_end: "Duration",
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

export const ChartUnits: { [key: string]: string } = {
  mbar: "mbar",
  "mS_cm-1": "mS/cm",
  "uS_cm-1": "µS/cm",
  "mg_L-1": "mg/l",
  degree_C: "°C",
  degree_: "°C",
};

export const EmptyDatabaseResult = new DatabaseError(406, "Database error occurred. Result is empty.", []);

export const ChartTitle: { [key: string]: string } = {
  oxygen_per_liter: "Oxygen",
  salinity: "Salinity",
  temperature: "Temperature",
  oxygen: "Oxygen partial pressure",
  conductivity: "Conductivity",
  pressure: "Pressure",
};
