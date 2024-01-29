import { Deployment, Logger, Platform, Vessel } from "@/backend/entities";

import { PlatformsCombinedWithVessels } from "@/backend/services/PlatformService";

export type Option = PlatformsCombinedWithVessels | Region | Logger | Deployment;

export type Region = {
  name: string;
  coords: { north: number[]; south: number[]; west: number[]; east: number[] };
};

export type Anker = {
  id: string;
  title: string;
};

export type DeploymentTableData = Deployment & Platform & Vessel;
