'use server'

import DBController from '@/utils/DBController'
/**
 * Single instance of the DB controller for this server runtime.
 * - In a container or long-lived process: instantiated once and reused.
 * - In serverless runtimes (e.g. Vercel / OpenNext): this may still be re-created per invocation,
 *   but it’s cheap and safe - like me.
 */
let DB

if (!DB) {
  DB = new DBController()
}
export const checkSession = async (userId, webSessionId) => {
  // someone could delete the web session cookie and refresh the page and still be logged in by keeping the next auth cookie.
  // the middleware (proxy as its now called...) will regen a new session, but they need adding to the db
  let result = await DB.query(
    `
    SELECT id
    FROM logged_in_history
    WHERE session_id = $1
      AND deleted_at IS NULL
  `,
    [webSessionId],
    webSessionId
  )

  if (!result.rows[0]) {
    result = await DB.query(
      `
        INSERT INTO logged_in_history (user_id, session_id)
        VALUES ($1, $2) RETURNING *;
    `,
      [userId, webSessionId],
      webSessionId
    )
  }

  return result.rows[0]
}
