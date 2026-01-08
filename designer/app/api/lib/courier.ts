import { Courier } from "@trycourier/courier";

let courierClient: Courier | null = null;

export function getCourierClient() {
  if (!courierClient) {
    const apiKey = process.env.COURIER_AUTH_TOKEN;
    if (!apiKey) {
      throw new Error("COURIER_AUTH_TOKEN environment variable is not set");
    }
    courierClient = new Courier({ apiKey });
  }
  return courierClient;
}

