import { Deployment, Logger, Platform, Vessel } from "@/backend/entities";
import { PlatformsCombinedWithVessels } from "@/backend/services/PlatformService";

// Define a union type for options that can be either PlatformsCombinedWithVessels, Region, Logger, or Deployment
export type Option = PlatformsCombinedWithVessels | Region | Logger | Deployment;

// Define the Region type with name, polygon, and coordinates properties
export type Region = {
  name: string;
  polygon: string;
  coordinates: number[][][][];
};

// Define the Anchor type with id and title properties
export type Anchor = {
  id: string;
  title: string;
};

// Define a type that combines Deployment, Platform, and Vessel types
export type DeploymentTableData = Deployment & Platform & Vessel;

// Define the DatabaseErrorType interface with properties for error code, message, and database response
export interface DatabaseErrorType {
  _error: number;
  _message: string;
  _dbResponse: any;
}

// Define the OverviewDeploymentTrackData type with properties for deployment tracking data
export type OverviewDeploymentTrackData = {
  deployment_id: number;
  logger_id: number;
  name: number;
  time_start: number;
  deepest: number;
  time_end: number;
  position_start: { x: number; y: number };
};

// Define the Switch type with a single property to show data on the map
export type Switch = { showInMap: boolean };

// Define the SwitchTableData type by combining OverviewDeploymentTrackData and Switch types
export type SwitchTableData = OverviewDeploymentTrackData & Switch;

// Define the Salinity type with a single property for salinity in PSU
export type Salinity = { Salinity_psu: number };
