import { Deployment, Logger, Platform, Vessel } from "@/backend/entities";

import { PlatformsCombinedWithVessels } from "@/backend/services/PlatformService";

export type Option = PlatformsCombinedWithVessels | Region | Logger | Deployment;

export type Region = {
  name: string;
  polygon: string;
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
