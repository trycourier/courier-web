import { Courier } from "@trycourier/courier";

let courierClient: Courier | null = null;

export function getCourierClient(baseUrl: string, apiKey?: string) {

  const key = apiKey || process.env.COURIER_AUTH_TOKEN;
  if (!key) {
    throw new Error("COURIER_AUTH_TOKEN environment variable is not set");
  }

  courierClient = new Courier({
    apiKey: key,
    baseURL: baseUrl,
  });

  return courierClient;
}

