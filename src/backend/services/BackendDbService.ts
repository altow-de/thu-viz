import { TableExpression } from "kysely";
import { db } from "../db";
import { DB } from "../generated-db";

export abstract class BackendDbService {
  protected tableName: TableExpression<DB, keyof DB>;

  constructor(tableName: TableExpression<DB, keyof DB>) {
    this.tableName = tableName;
  }

  async getAll() {
    const result = await db.selectFrom(this.tableName).selectAll().execute();
    return result;
  }
}
