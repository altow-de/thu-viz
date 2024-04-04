import { Deployment, Logger, Platform, Vessel } from "@/backend/entities";
import { OverviewDeploymentTrackData } from "@/backend/services/DeploymentService";

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

export type Switch = { showInMap: boolean };
export type SwitchTableData = OverviewDeploymentTrackData & Switch;
