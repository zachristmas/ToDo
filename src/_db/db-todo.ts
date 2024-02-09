import Database, { QueryResult } from "tauri-plugin-sql-api"

let db: Database | null = null

/**
 * Retrieves the database instance.
 * If the database instance does not exist, it will be loaded.
 * @returns {Promise<Database>} The database instance.
 */
async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:todo.db")
  }
  return db
}

/**
 * Executes a SQL query with optional parameters.
 * @param {string} sql - The SQL query to execute.
 * @param {any[]} params - The optional parameters for the query.
 * @returns {Promise<void>} A promise that resolves when the query is executed.
 */
export async function execute(sql: string, params: any[]): Promise<QueryResult> {
  const database = await getDb()
  return await database.execute(sql, params)
}

/**
 * Executes a SELECT SQL query and returns the result as an array of objects.
 * @param {string} sql - The SELECT SQL query to execute.
 * @returns {Promise<T[]>} A promise that resolves with the result as an array of objects.
 * @template T - The type of the objects in the result array.
 */
export async function select<T>(sql: string): Promise<T[]> {
  const database = await getDb()
  return await database.select(sql)
}
