import { DatabaseError } from "@/backend/services/DatabaseError";
import { MeasurementAnchors, OverviewAnchors } from "./enum";
import { Anchor } from "./types";

// Navigation pages available in the application
export const NavigationPage = ["Overview", "Measurement Data"];

// Different map styles available for the user
export const MapStyles: { [key: string]: string } = {
  "basic-v2": "Street Map",
  satellite: "Satellite",
};

// Zoom level configuration for map layers
export const LayerZoom = { minzoom: 0, maxzoom: 22 };

// Titles and identifiers for the Overview section anchors
export const OverviewAnchorTitles: Anchor[] = [
  {
    id: OverviewAnchors.MeasurementSelection,
    title: "Selection of measurement data",
  },
  { id: OverviewAnchors.OverviewDeployments, title: "Overview of selected measurement data" },
  {
    id: OverviewAnchors.PositionOfDeployments,
    title: "Measurement locations (start positions of deployments)",
  },
];

// Titles and identifiers for the Measurement section anchors
export const MeasurementAnchorTitles: Anchor[] = [
  {
    id: MeasurementAnchors.SelectionSingleDeployment,
    title: "Selection of single deployment",
  },
  { id: MeasurementAnchors.Metadata, title: "Metadata (short selection)" },
  { id: MeasurementAnchors.ParameterOverTime, title: "Parameter over time" },
  { id: MeasurementAnchors.ParameterOverDepth, title: "Parameter over depth" },
  { id: MeasurementAnchors.Track, title: "Track" },
];

// Column titles for the data table
export const TableTitle = {
  deployment_id: "Deployment",
  logger_id: "Logger",
  name: "Platform",
  time_start: "Date",
  deepest: "max. Depth",
  time_end: "Duration",
};

// Keys for mapping table data to display values
export const TableDataKeys = {
  time_start: "Time begin",
  time_end: "Time end",
  name: "Vessel",
  position_start: "Position start: lat, long",
  position_end: "Position end: lat, long",
};

// Locale options for formatting dates and times
export const DateTimeLocaleOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

// Units for displaying chart data
export const ChartUnits: { [key: string]: string } = {
  mbar: "mbar",
  "mS_cm-1": "mS/cm",
  "uS_cm-1": "µS/cm",
  "mg_L-1": "mg/l",
  degree_C: "°C",
  degree_: "°C",
};

// Error object for empty database results
export const EmptyDatabaseResult = new DatabaseError(406, "Database error occurred. Result is empty.", []);

// Titles for different chart types
export const ChartTitle: { [key: string]: string } = {
  oxygen_per_liter: "Oxygen",
  salinity: "Salinity",
  temperature: "Temperature",
  oxygen: "Oxygen partial pressure",
  conductivity: "Conductivity",
  pressure: "Pressure",
};

// Keys for hover info in charts and maps
export const HoverInfoKeys: { [key: string]: string } = {
  deepest: "Depth ",
  measuring_time: "",
  name: "Vessel ",
  logger_id: "Logger ",
  deployment_id: "Deployment ",
};

// Default configuration values for window size and threshold in calculations
export const DefaultWindowHalfSite = 5;
export const DefaultThreshold = 0.2;
