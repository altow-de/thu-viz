// Enumeration for different types of maps
export enum MapType {
  point, // Point type map (single point data visualization)
  route, // Route type map (track or path data visualization)
}

// Enumeration for anchor IDs used in the Measurement section
export enum MeasurementAnchors {
  SelectionSingleDeployment = "selection-single-deployment", // Anchor for selecting a single deployment
  Metadata = "metadata", // Anchor for displaying metadata
  ParameterOverTime = "parameter-over-time", // Anchor for parameters over time chart
  ParameterOverDepth = "parameter-over-depth", // Anchor for parameters over depth chart
  Track = "track", // Anchor for displaying track data
}

// Enumeration for anchor IDs used in the Overview section
export enum OverviewAnchors {
  MeasurementSelection = "measurement-selection", // Anchor for selecting measurement data
  OverviewDeployments = "overview-deployments", // Anchor for overview of deployments
  PositionOfDeployments = "position-of-deployments", // Anchor for positions of deployments
}

// Enumeration for keys used in the legend
export enum LegendKey {
  CastDetecion = "cast_detection", // Key for cast detection in legend
  Sensitivity = "sensitivity", // Key for sensitivity in legend
}
