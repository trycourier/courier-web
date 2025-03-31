export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

export class CourierClient {

  // private baseURL: string;
  // private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: ApiConfig) {
    // this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    // this.defaultHeaders = {
    //   'Content-Type': 'application/json',
    //   ...config.headers,
    // };
  }

  public async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  }

}

export default CourierClient;