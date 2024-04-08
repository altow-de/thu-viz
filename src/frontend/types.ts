import { Deployment, Logger, Platform, Vessel } from "@/backend/entities";
import { PlatformsCombinedWithVessels } from "@/backend/services/PlatformService";

export type Option = PlatformsCombinedWithVessels | Region | Logger | Deployment;

export type Region = {
  name: string;
  polygon: string;
  coordinates: number[][][][];
};

export type Anker = {
  id: string;
  title: string;
};

export type DeploymentTableData = Deployment & Platform & Vessel;

export interface DatabaseErrorType {
  _error: number;
  _message: string;
  _dbResponse: any;
}

export type OverviewDeploymentTrackData = {
  deployment_id: number;
  logger_id: number;
  name: number;
  time_start: number;
  deepest: number;
  time_end: number;
  position_start: { x: number; y: number };
};

export type Switch = { showInMap: boolean };
export type SwitchTableData = OverviewDeploymentTrackData & Switch;

export type Salinity = { Salinity_psu: number };
