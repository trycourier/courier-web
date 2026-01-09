import { Courier } from "@trycourier/courier";

let courierClient: Courier | null = null;

export function getCourierClient(overrideApiKey?: string) {
  // If an override API key is provided, create a new client with it
  if (overrideApiKey) {
    return new Courier({ apiKey: overrideApiKey });
  }
  
  // Otherwise use the cached client with the environment API key
  if (!courierClient) {
    const apiKey = process.env.COURIER_AUTH_TOKEN;
    if (!apiKey) {
      throw new Error("COURIER_AUTH_TOKEN environment variable is not set");
    }
    courierClient = new Courier({ apiKey });
  }
  return courierClient;
}

