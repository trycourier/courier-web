import { getCourierApiUrls } from "../types/courier-api-urls";
import { CourierClientOptions } from "./courier-client";

export class Client {

  constructor(public readonly options: CourierClientOptions) {
    this.options = options;
  }

  get urls() {
    return getCourierApiUrls(this.options);
  }

  // Will default to jwt if available, otherwise publicApiKey
  get accessToken() {
    return this.options.jwt ?? this.options.publicApiKey;
  }

}

