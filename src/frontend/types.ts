import { PlatformsCombinedWithVessels } from "@/backend/services/PlatformService";

export type Option = PlatformsCombinedWithVessels | Region;

export type Region = {
  name: string;
  coords: { north: number[]; south: number[]; west: number[]; east: number[] };
};

export type Anker = {
  id: string;
  title: string;
};
