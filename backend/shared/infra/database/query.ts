import { ResultSetHeader, RowDataPacket } from "mysql2/promise"
import pool from "./conexaoDB"

export async function runQuery<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await pool.query<RowDataPacket[]>(sql, params)
  return rows as T[]
}

export async function runOne<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  const rows = await runQuery<T>(sql, params)
  return rows[0]
}

export async function execute(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
  const [result] = await pool.query<ResultSetHeader>(sql, params)
  return result
}
