import { getCourierApiUrls } from "../types/courier-api-urls";
import { CourierClientOptions } from "./courier-client";

export class Client {
  constructor(public readonly options: CourierClientOptions) {
    this.options = options;
  }

  get urls() {
    return getCourierApiUrls(this.options);
  }
}

