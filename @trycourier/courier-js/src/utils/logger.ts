import { CourierClientOptions } from "../client/courier-client";

export interface LoggerOptions {
  showLogs?: boolean;
}

export class Logger {
  private options: CourierClientOptions;

  constructor(options: CourierClientOptions) {
    this.options = options;
  }

  public warn(message: string, ...args: any[]): void {
    if (this.options.showLogs) {
      console.warn(`[Courier] ${message}`, ...args);
    }
  }

  public log(message: string, ...args: any[]): void {
    if (this.options.showLogs) {
      console.log(`[Courier] ${message}`, ...args);
    }
  }

  public error(message: string, ...args: any[]): void {
    if (this.options.showLogs) {
      console.error(`[Courier] ${message}`, ...args);
    }
  }

  public debug(message: string, ...args: any[]): void {
    if (this.options.showLogs) {
      console.debug(`[Courier] ${message}`, ...args);
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.options.showLogs) {
      console.info(`[Courier] ${message}`, ...args);
    }
  }
}
