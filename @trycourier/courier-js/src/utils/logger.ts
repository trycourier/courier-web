export class Logger {

  private readonly PREFIX = '[COURIER]';

  constructor(private readonly showLogs: boolean) { }

  public warn(message: string, ...args: any[]): void {
    if (this.showLogs) {
      console.warn(`${this.PREFIX} ${message}`, ...args);
    }
  }

  public log(message: string, ...args: any[]): void {
    if (this.showLogs) {
      // console.log(`${this.PREFIX} ${message}`, ...args);
    }
  }

  public error(message: string, ...args: any[]): void {
    if (this.showLogs) {
      console.error(`${this.PREFIX} ${message}`, ...args);
    }
  }

  public debug(message: string, ...args: any[]): void {
    if (this.showLogs) {
      console.debug(`${this.PREFIX} ${message}`, ...args);
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.showLogs) {
      console.info(`${this.PREFIX} ${message}`, ...args);
    }
  }
}
