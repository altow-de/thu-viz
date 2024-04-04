import { DatabaseError } from "@/backend/services/DatabaseError";
import { makeAutoObservable } from "mobx";
import { SwitchTableData } from "../types";

export class DataStore {
  public error: DatabaseError | null = null;
  public selectedNav: number = 0;
  public selectedColumn: { logger_id: number; deployment_id: number } = { logger_id: -1, deployment_id: -1 };
  public tableData: SwitchTableData[] = [];
  public dataChanged: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setError(error: DatabaseError | null) {
    this.error = error;
  }

  setSelectedNav(selected: number) {
    this.selectedNav = selected;
  }

  setSelectedColumn(logger_id: number, deployment_id: number) {
    this.selectedColumn = { logger_id: logger_id, deployment_id: deployment_id };
  }

  setTableData(data: SwitchTableData[]) {
    this.tableData = data;
  }

  setDataChanged(changed: boolean) {
    this.dataChanged = changed;
  }
}
