import { TableExpression } from "kysely";
import { db } from "../db";
import { DB } from "../generated-db";
import { EmptyDatabaseResult } from "@/frontend/constants";
import { DatabaseError } from "./DatabaseError";

export abstract class BackendDbService {
  protected tableName: TableExpression<DB, keyof DB>;

  constructor(tableName: TableExpression<DB, keyof DB>) {
    this.tableName = tableName;
  }

  async getAll() {
    try {
      const result = await db.selectFrom(this.tableName).selectAll().execute();
      if (result.length === 0) {
        throw EmptyDatabaseResult;
      } else {
        return result;
      }
    } catch (error) {
      throw error === EmptyDatabaseResult ? error : new DatabaseError(405, "Database error occurred.", error);
    }
  }
}
