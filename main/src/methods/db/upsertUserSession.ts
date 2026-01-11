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

/**
 * Upserts a session record for a user, refreshing it if it's < 1 day old,
 * or creating a new one if it doesn't exist or is stale.
 */
export async function upsertUserSession(userId: number, webSessionId: string) {
  const query = `
    WITH existing AS (SELECT *
                      FROM logged_in_history
                      WHERE user_id = $1
                        AND session_id = $2
                      ORDER BY created_at DESC
      LIMIT 1
      )
       , updated AS (
    UPDATE logged_in_history
    SET updated_at = NOW()
    WHERE user_id = $1
      AND session_id = $2
      AND updated_at
        > NOW() - INTERVAL '1 day'
      RETURNING *
      )
    INSERT
    INTO logged_in_history (user_id, session_id)
    SELECT $1,
           $2 WHERE NOT EXISTS (
      SELECT 1 FROM updated
    )
    RETURNING *;
  `

  const result = await DB.query(query, [userId, webSessionId], webSessionId)

  return result.rows?.[0] ?? null
}
