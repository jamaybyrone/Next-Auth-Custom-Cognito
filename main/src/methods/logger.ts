import Cookies from 'js-cookie'
import { sessionCookie } from '@/consts/cookie'

export default class Log {
  readonly session: string
  readonly logger: Console
  readonly extend: string | undefined
  constructor(location: string, session?: string) {
    this.session =
      typeof window === 'undefined' ? session : Cookies.get(sessionCookie)
    this.logger = console
    this.extend = '- during ' + location + ' - '
  }

  private readonly format = (data: string | object) =>
    typeof data === 'object' ? JSON.stringify(data, null, 2) : data

  public info = (message: string | object) => {
    this.logger.info(
      `session: ${this.session} - info ${this.extend}`,
      this.format(message)
    )
  }
  public warn = (message: string | object) => {
    this.logger.warn(
      `session: ${this.session} - warn ${this.extend}`,
      this.format(message)
    )
  }
  public error = (message: string | object) => {
    this.logger.error(
      `session: ${this.session} - error ${this.extend}`,
      this.format(message)
    )
  }
}
