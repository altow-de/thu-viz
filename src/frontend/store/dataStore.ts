import { DatabaseError } from "@/backend/services/DatabaseError";
import { makeAutoObservable } from "mobx";

export class DataStore {
  public error: DatabaseError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setError(error: DatabaseError) {
    this.error = error;
  }
}
