import { Pool } from 'pg'
import Log from '@/utils/logger'

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  LOG_LEVEL
} = process.env

export default class DBController {
  private readonly client
  private readonly logger

  constructor() {
    this.client = new Pool({
      host: DATABASE_HOST,
      port: Number(DATABASE_PORT),
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME
    })
    this.logger = new Log('DB Controller')
  }

  query = async (sql: string, params: unknown[], webSession) => {
    if (LOG_LEVEL === 'debug') {
      this.logger.info('------Start DB Call------', webSession)
      this.logger.info('sql ' + sql, webSession)
      this.logger.info('params ' + JSON.stringify(params), webSession)
      this.logger.info('------END DB Call--------', webSession)
    }

    let result
    try {
      result = await this.client.query(sql, params)
    } catch (e) {
      this.logger.error(e.message ?? e, webSession)
    }
    return result
  }
}
