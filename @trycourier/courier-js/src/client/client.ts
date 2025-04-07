import { CourierClientOptions } from "./courier-client";

export class Client {

  constructor(readonly options: CourierClientOptions) {
    this.options = options;
  }

}
