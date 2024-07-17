import { DatabaseError } from "@/backend/services/DatabaseError";
import { makeAutoObservable } from "mobx";
import { SwitchTableData } from "../types";

/**
 * DataStore class for managing the application state using MobX.
 */
export class DataStore {
  public error: DatabaseError | null = null;
  public selectedNav: number = 0;
  public selectedColumn: { logger_id: number; deployment_id: number } = { logger_id: -1, deployment_id: -1 };
  public tableData: SwitchTableData[] = [];
  public dataChanged: boolean = false;
  public switchReset: boolean = false;

  /**
   * Constructor to initialize the DataStore with MobX.
   */
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Sets the error state.
   *
   * @param {DatabaseError | null} error - The error object or null.
   */
  setError(error: DatabaseError | null) {
    this.error = error;
  }

  /**
   * Sets the selected navigation index.
   *
   * @param {number} selected - The selected navigation index.
   */
  setSelectedNav(selected: number) {
    this.selectedNav = selected;
  }

  /**
   * Sets the selected column with logger and deployment IDs.
   *
   * @param {number} logger_id - The logger ID.
   * @param {number} deployment_id - The deployment ID.
   */
  setSelectedColumn(logger_id: number, deployment_id: number) {
    this.selectedColumn = { logger_id: logger_id, deployment_id: deployment_id };
  }

  /**
   * Sets the table data.
   *
   * @param {SwitchTableData[]} data - The table data.
   */
  setTableData(data: SwitchTableData[]) {
    this.tableData = data;
  }

  /**
   * Sets the dataChanged state to trigger updates.
   *
   * @param {boolean} changed - Indicates if the data has changed.
   */
  setDataChanged(changed: boolean) {
    this.dataChanged = changed;
  }

  /**
   * Sets the switchReset state to reset switches.
   *
   * @param {boolean} switchReset - Indicates if the switches should be reset.
   */
  setSwitchReset(switchReset: boolean) {
    this.switchReset = switchReset;
  }
}
