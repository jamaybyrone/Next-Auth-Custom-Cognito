export default class Log {
  readonly logger: Console
  readonly extend: string | undefined
  constructor(location: string) {
    this.logger = console
    this.extend = '- during ' + location + ' - '
  }

  private readonly format = (data: string | object) =>
    typeof data === 'object' ? JSON.stringify(data, null, 2) : data

  public info = (message: string | object, session: string) => {
    this.logger.info(
      `session: ${session} - info ${this.extend}`,
      this.format(message)
    )
  }
  public warn = (message: string | object, session: string) => {
    this.logger.warn(
      `session: ${session} - warn ${this.extend}`,
      this.format(message)
    )
  }
  public error = (message: string | object, session: string) => {
    this.logger.error(
      `session: ${session} - error ${this.extend}`,
      this.format(message)
    )
  }
}
