'use server'

import DBController from '@/utils/DBController'

/**
 * Single instance of the DB controller for this server runtime.
 * - In a container or long-lived process: instantiated once and reused.
 * - In serverless runtimes (e.g. Vercel / OpenNext): this may still be re-created per invocation,
 *   but it’s cheap and safe - like me.
 */
let DB: DBController

if (!DB) {
  DB = new DBController()
}
export const addNewUserInUserTable = async (
  uid,
  email,
  name,
  provider,
  webSessionId
):Promise<number> => {
  const insertQuery = `
    INSERT INTO users (uuid, email, full_name,  provider)
    VALUES ($1, $2, $3, $4) RETURNING id;
  `
  const result = await DB.query(
    insertQuery,
    [uid, email, name, provider],
    webSessionId
  )

  return result.rows[0].id
}
