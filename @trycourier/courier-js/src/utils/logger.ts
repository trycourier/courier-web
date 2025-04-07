export class Logger {

  constructor(private readonly showLogs: boolean) {
    this.showLogs = showLogs;
  }

  public warn(message: string, ...args: any[]): void {
    if (this.showLogs) {
      console.warn(`[Courier] ${message}`, ...args);
    }
  }

  public log(message: string, ...args: any[]): void {
    if (this.showLogs) {
      console.log(`[Courier] ${message}`, ...args);
    }
  }

  public error(message: string, ...args: any[]): void {
    if (this.showLogs) {
      console.error(`[Courier] ${message}`, ...args);
    }
  }

  public debug(message: string, ...args: any[]): void {
    if (this.showLogs) {
      console.debug(`[Courier] ${message}`, ...args);
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.showLogs) {
      console.info(`[Courier] ${message}`, ...args);
    }
  }
}
