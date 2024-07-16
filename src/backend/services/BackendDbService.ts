import { TableExpression } from "kysely";
import { db } from "../db";
import { DB } from "../generated-db";
import { EmptyDatabaseResult } from "@/frontend/constants";
import { DatabaseError } from "./DatabaseError";

/**
 * Abstract class representing a backend database service.
 */
export abstract class BackendDbService {
  protected tableName: TableExpression<DB, keyof DB>;

  /**
   * Creates an instance of BackendDbService.
   * @param {TableExpression<DB, keyof DB>} tableName - The name of the database table.
   */
  constructor(tableName: TableExpression<DB, keyof DB>) {
    this.tableName = tableName;
  }

  /**
   * Retrieves all records from the specified table.
   * @returns {Promise<any[]>} - A promise that resolves with the list of records.
   * @throws {DatabaseError | EmptyDatabaseResult} - Throws an error if the database operation fails or no records are found.
   */
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
