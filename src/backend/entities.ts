import { Selectable } from "kysely";
import { DB } from "./generated-db";

//types from db generation

export type Logger = Selectable<DB["Logger"]>;
export type Deployment = Selectable<DB["Deployment"]>;
export type Platform = Selectable<DB["Platform"]>;
export type Vessel = Selectable<DB["Vessel"]>;
export type ProcessedValue = Selectable<DB["ProcessedValue"]>;
export type RawValue = Selectable<DB["RawValue"]>;
// export type PlatformContainsLogger = Selectable<DB["PlatformContainsLogger"]>;
// export type DeckUnit = Selectable<DB["DeckUnit"]>;
// export type PlatformContainsDeckUnit = Selectable<DB["PlatformContainsDeckUnit"]>;
// export type LoggerContainsSensor = Selectable<DB["LoggerContainsSensor"]>;
// export type CalibrationCoefficient = Selectable<DB["CalibrationCoefficient"]>;
// export type SensorType = Selectable<DB["SensorType"]>;
// export type LoggerAllocatesDeckUnit = Selectable<DB["LoggerAllocatesDeckUnit"]>;
// export type Contact = Selectable<DB["Contact"]>;
// export type Device = Selectable<DB["Device"]>;
// export type Unit = Selectable<DB["Unit"]>;
