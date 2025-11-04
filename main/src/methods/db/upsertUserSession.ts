'use server'

import DBController from '@/utils/DBController'

// if your running this in a container, remember this is server side so this will be initialized once
// not per invocation.... only once... until the garbage collector is ran...
// remember your in server land now kids...
// server = everyone, client = yo browser boyo!
// if your running this in open-next, then the below time/memory saver is pointless for you...

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
                      FROM LoggedInHistory
                      WHERE UserId = $1
                        AND SessionId = $2
                      ORDER BY CreatedAt DESC
      LIMIT 1
      )
       , updated AS (
    UPDATE LoggedInHistory
    SET UpdatedAt = NOW()
    WHERE UserId = $1
      AND SessionId = $2
      AND UpdatedAt
        > NOW() - INTERVAL '1 day'
      RETURNING *
      )
    INSERT
    INTO LoggedInHistory (UserId, SessionId)
    SELECT $1,
           $2 WHERE NOT EXISTS (
      SELECT 1 FROM updated
    )
    RETURNING *;
  `

  const result = await DB.query(query, [userId, webSessionId], webSessionId)

  return result.rows?.[0] ?? null
}
