import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, number | string, number | string>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type LineString = Point[];

export type Point = {
  x: number;
  y: number;
};

export type Polygon = LineString[];

export interface CalibrationCoefficient {
  coefficient_id_per_sensor_id: number;
  sensor_id: number;
  time_calibration: Date;
  value: Decimal;
}

export interface Check {
  check_id: Generated<number>;
  description: string;
  level: string;
  route: string;
  type: string;
}

export interface CheckAtDeployment {
  check_id: number;
  deployment_id: number;
  description: Generated<string | null>;
  logger_id: number;
  passed: Generated<"0" | "1" | "3" | "4" | "5" | "9" | null>;
  time: Date;
}

export interface CheckAtProcessedValue {
  check_id: number;
  description: string;
  passed: Generated<"0" | "1" | "3" | "4" | "5" | "9" | null>;
  processed_value_id: number;
  time: Date;
}

export interface Command {
  command_id: Generated<number>;
  description: string;
  level: string;
  route: string;
}

export interface Contact {
  city: string;
  contact_id: Generated<number>;
  country: string;
  department: Generated<string | null>;
  "e-mail": string;
  first_name: string;
  function: Generated<string | null>;
  last_name: string;
  number: Generated<string | null>;
  organisation: Generated<string | null>;
  phone: Generated<string | null>;
  street: Generated<string | null>;
  title: Generated<string | null>;
}

export interface DeckUnit {
  date_manufactoring: Date;
  deck_unit_id: Generated<number>;
  device_id: number;
}

export interface Deployment {
  bounding_box: Polygon;
  contact_id: number;
  deployment_id: number;
  logger_id: number;
  position_end: Point;
  position_start: Point;
  time_end: Date;
  time_start: Date;
}

export interface Device {
  device_id: Generated<number>;
  type: string;
}

export interface DeviceState {
  description: Generated<string | null>;
  device_id: number;
  "DS-id": Generated<number>;
  state: Generated<string | null>;
  time_end: Generated<Date | null>;
  time_start: Generated<Date | null>;
}

export interface Errors {
  deployment_id: number;
  description: string;
  error_id: Generated<number>;
  logger_id: number;
  solved: Generated<number | null>;
  time: Date;
}

export interface Logger {
  Comment: Generated<string | null>;
  date_manufactoring: Date;
  device_id: number;
  fw_version: Generated<string | null>;
  logger_id: Generated<number>;
  manufacturer: string;
  operation_mode: string;
}

export interface LoggerAllocatesDeckUnit {
  deck_unit_id: number;
  logger_id: number;
  time_end: Generated<Date | null>;
  time_start: Date;
}

export interface LoggerContainsSensor {
  bus_address: Generated<number | null>;
  logger_id: number;
  sensor_id: number;
  time_end: Generated<Date | null>;
  time_start: Date;
}

export interface Platform {
  contact_id: number;
  platform_id: Generated<number>;
  type: Generated<string | null>;
}

export interface PlatformContainsDeckUnit {
  deck_unit_id: number;
  platform_id: number;
  time_end: Generated<Date | null>;
  time_start: Date;
}

export interface PlatformContainsLogger {
  logger_id: number;
  platform_id: number;
  time_end: Generated<Date | null>;
  time_start: Date;
}

export interface ProcessedValue {
  command_id: number;
  depth: Generated<Decimal | null>;
  measuring_time: Date;
  position: Point;
  processed_value_id: Generated<number>;
  processing_time: Date;
  published: Generated<number>;
  sensor_settling_time: number;
  unit_id: number;
  valid: number;
  value: Generated<Decimal | null>;
}

export interface ProcessedValueHasPredecessor {
  predecessor_value_id: number;
  processed_value_id: number;
}

export interface ProcessedValueHasRawValue {
  deployment_id: number;
  logger_id: number;
  processed_value_id: number;
  raw_value_id: number;
  sensor_id: number;
}

export interface QualityChecks {
  passed: number;
  quality_description: string;
  quality_id: "0" | "1" | "3" | "4" | "5" | "9";
}

export interface RawValue {
  deployment_id: number;
  logger_id: number;
  measuring_location: Point;
  measuring_time: Date;
  pressure: number;
  raw_value_id: number;
  sensor_id: number;
  value: Generated<Decimal | null>;
}

export interface Sensor {
  comment: Generated<string | null>;
  date_first_deployed: Generated<Date | null>;
  date_last_deployed: Generated<Date | null>;
  date_manufactoring: Date;
  sensor_id: Generated<number>;
  sensor_type_id: number;
  serial_number: string;
}

export interface SensorType {
  accuracy: Generated<number | null>;
  calculation_rule: string;
  description: Generated<string | null>;
  digits_calibration_coefficients: number;
  digits_raw_value: number;
  long_name: Generated<string | null>;
  manufacturer: string;
  model: string;
  no_of_calibration_coefficients: number;
  parameter: string;
  parameter_no: Generated<number>;
  resolution: Generated<number | null>;
  sensor_type_id: Generated<number>;
  time_constant: Decimal;
  unit_id: number;
}

export interface Unit {
  description: string;
  unit: string;
  unit_id: Generated<number>;
}

export interface UserConfigInterface {
  password: string;
  username: string;
}

export interface Vessel {
  call_sign: string;
  fishery_type: string;
  homeport: Generated<string | null>;
  length: string;
  name: string;
  platform_id: Generated<number>;
  shipowner: string;
}

export interface WeatherParameter {
  designation: string;
  digits_value: string;
  source: string;
  unit_id: number;
  weather_parameter_id: Generated<number>;
}

export interface WeatherValue {
  deployment_id: number;
  position: Point;
  time: Date;
  value: Decimal;
  weather_parameter_id: number;
  weather_value_id: number;
}

export interface DB {
  CalibrationCoefficient: CalibrationCoefficient;
  Check: Check;
  CheckAtDeployment: CheckAtDeployment;
  CheckAtProcessedValue: CheckAtProcessedValue;
  Command: Command;
  Contact: Contact;
  DeckUnit: DeckUnit;
  Deployment: Deployment;
  Device: Device;
  DeviceState: DeviceState;
  Errors: Errors;
  Logger: Logger;
  LoggerAllocatesDeckUnit: LoggerAllocatesDeckUnit;
  LoggerContainsSensor: LoggerContainsSensor;
  Platform: Platform;
  PlatformContainsDeckUnit: PlatformContainsDeckUnit;
  PlatformContainsLogger: PlatformContainsLogger;
  ProcessedValue: ProcessedValue;
  ProcessedValueHasPredecessor: ProcessedValueHasPredecessor;
  ProcessedValueHasRawValue: ProcessedValueHasRawValue;
  QualityChecks: QualityChecks;
  RawValue: RawValue;
  Sensor: Sensor;
  SensorType: SensorType;
  Unit: Unit;
  UserConfigInterface: UserConfigInterface;
  Vessel: Vessel;
  WeatherParameter: WeatherParameter;
  WeatherValue: WeatherValue;
}
