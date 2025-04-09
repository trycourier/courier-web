import { CourierClientOptions } from "../client/courier-client";
import { Logger } from "./logger";

export class CourierRequestError extends Error {
  constructor(
    public code: number,
    message: string,
    public type?: string
  ) {
    super(message);
    this.name = 'CourierRequestError';
  }
}

function logRequest(logger: Logger, uid: string, type: 'HTTP' | 'GraphQL', data: {
  url: string;
  method?: string;
  headers: Record<string, string>;
  body?: any;
  query?: string;
  variables?: Record<string, any>;
}) {
  logger.log(`
📡 New Courier ${type} Request: ${uid}
URL: ${data.url}
${data.method ? `Method: ${data.method}` : ''}
${data.query ? `Query: ${data.query}` : ''}
${data.variables ? `Variables: ${JSON.stringify(data.variables, null, 2)}` : ''}
Headers: ${JSON.stringify(data.headers, null, 2)}
Body: ${data.body ? JSON.stringify(data.body, null, 2) : 'Empty'}
  `);
}

function logResponse(logger: Logger, uid: string, type: 'HTTP' | 'GraphQL', data: {
  status: number;
  response: any;
}) {
  logger.log(`
📡 New Courier ${type} Response: ${uid}
Status Code: ${data.status}
Response JSON: ${JSON.stringify(data.response, null, 2)}
  `);
}

export async function http(props: {
  url: string,
  options: CourierClientOptions,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  headers: Record<string, string>,
  body?: any,
  validCodes?: number[]
}): Promise<any> {
  const validCodes = props.validCodes ?? [200];
  const uid = props.options.showLogs ? crypto.randomUUID() : undefined;

  // Create request
  const request = new Request(props.url, {
    method: props.method,
    headers: {
      'Content-Type': 'application/json',
      ...props.headers
    },
    body: props.body ? JSON.stringify(props.body) : undefined
  });

  // Log request if enabled
  if (uid) {
    logRequest(props.options.logger, uid, 'HTTP', {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: props.body
    });
  }

  // Perform request
  const response = await fetch(request);

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return;
  }

  // Try to parse JSON response
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new CourierRequestError(
      response.status,
      'Failed to parse response as JSON',
      'PARSE_ERROR'
    );
  }

  // Log response if enabled
  if (uid) {
    logResponse(props.options.logger, uid, 'HTTP', {
      status: response.status,
      response: data
    });
  }

  // Handle invalid status codes
  if (!validCodes.includes(response.status)) {
    throw new CourierRequestError(
      response.status,
      data?.message || 'Unknown Error',
      data?.type
    );
  }

  return data;
}

export async function graphql(props: {
  url: string,
  options: CourierClientOptions,
  headers: Record<string, string>,
  query: string,
  variables?: Record<string, any>
}): Promise<any> {
  const uid = props.options.showLogs ? crypto.randomUUID() : undefined;

  // Log request if enabled
  if (uid) {
    logRequest(props.options.logger, uid, 'GraphQL', {
      url: props.url,
      headers: props.headers,
      query: props.query,
      variables: props.variables
    });
  }

  const response = await fetch(props.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...props.headers
    },
    body: JSON.stringify({
      query: props.query,
      variables: props.variables
    })
  });

  // Try to parse JSON response
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new CourierRequestError(
      response.status,
      'Failed to parse response as JSON',
      'PARSE_ERROR'
    );
  }

  // Log response if enabled
  if (uid) {
    logResponse(props.options.logger, uid, 'GraphQL', {
      status: response.status,
      response: data
    });
  }

  if (!response.ok) {
    throw new CourierRequestError(
      response.status,
      data?.message || 'Unknown Error',
      data?.type
    );
  }

  return data;
}
