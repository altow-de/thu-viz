import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { DB } from "./generated-db";

// Retrieve the database connection string from the environment variables
const databaseConnectionString = process.env.DATABASE_URL;

// Throw an error if the DATABASE_URL environment variable is missing
if (!databaseConnectionString) {
  throw new Error("Environment variable DATABASE_URL is missing.");
}

// Create a Kysely instance with the MySQL dialect and connection pool
export const db = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: createPool(databaseConnectionString),
  }),
});
