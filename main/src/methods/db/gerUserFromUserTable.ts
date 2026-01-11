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

export const getUserFromUserTable = async (uid, sessionId):Promise<number | null>  => {
  const selectQuery = `
      SELECT id FROM users
      WHERE uuid = $1
  ` // love a good soft delete
  const result = await DB.query(selectQuery, [uid], sessionId)

  return result.rows[0].id
}
