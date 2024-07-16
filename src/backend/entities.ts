import { Selectable } from "kysely";
import { DB } from "./generated-db";

//types from db generation

export type Logger = Selectable<DB["Logger"]>;
export type Deployment = Selectable<DB["Deployment"]>;
export type Platform = Selectable<DB["Platform"]>;
export type Vessel = Selectable<DB["Vessel"]>;
export type ProcessedValue = Selectable<DB["ProcessedValue"]>;
export type RawValue = Selectable<DB["RawValue"]>;
export type ProcessedValueHasRawValue = Selectable<DB["ProcessedValueHasRawValue"]>;
