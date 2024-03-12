import { DatabaseError } from "@/backend/services/DatabaseError";
import { makeAutoObservable } from "mobx";

export class DataStore {
  public error: DatabaseError | null = null;
  public selectedNav: number = -1;
  public selectedColumn: { logger_id: number; deployment_id: number } = { logger_id: -1, deployment_id: -1 };

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
}
