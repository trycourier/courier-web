import { CourierClientOptions } from "../client/courier-client";

export class CourierHttpError extends Error {
  constructor(
    public code: number,
    message: string,
    public type?: string
  ) {
    super(message);
    this.name = 'CourierHttpError';
  }
}

function logRequest(uid: string, type: 'HTTP' | 'GraphQL', data: {
  url: string;
  method?: string;
  headers: Record<string, string>;
  body?: any;
  query?: string;
  variables?: Record<string, any>;
}) {
  console.log(`
📡 New Courier ${type} Request: ${uid}
URL: ${data.url}
${data.method ? `Method: ${data.method}` : ''}
${data.query ? `Query: ${data.query}` : ''}
${data.variables ? `Variables: ${JSON.stringify(data.variables, null, 2)}` : ''}
Headers: ${JSON.stringify(data.headers, null, 2)}
Body: ${data.body ? JSON.stringify(data.body, null, 2) : 'Empty'}
  `);
}

function logResponse(uid: string, type: 'HTTP' | 'GraphQL', data: {
  status: number;
  response: any;
}) {
  console.log(`
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
  if (props.options.showLogs && uid) {
    logRequest(uid, 'HTTP', {
      url: props.url,
      method: props.method,
      headers: props.headers,
      body: props.body
    });
  }

  // Perform request
  const response = await fetch(request);
  const data = await response.json();

  // Log response if enabled
  if (props.options.showLogs && uid) {
    logResponse(uid, 'HTTP', {
      status: response.status,
      response: data
    });
  }

  // Handle invalid status codes
  if (!validCodes.includes(response.status)) {
    throw new CourierHttpError(
      response.status,
      data.message || 'Unknown Error',
      data.type
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
  if (props.options.showLogs && uid) {
    logRequest(uid, 'GraphQL', {
      url: props.url,
      headers: props.headers,
      query: props.query,
      variables: props.variables
    });
  }

  const response = await fetch(props.url, {
    method: 'POST',
    headers: props.headers,
    body: JSON.stringify({
      query: props.query,
      variables: props.variables
    })
  });

  const data = await response.json();

  // Log response if enabled
  if (props.options.showLogs && uid) {
    logResponse(uid, 'GraphQL', {
      status: response.status,
      response: data
    });
  }

  if (!response.ok) {
    throw new CourierHttpError(
      response.status,
      data.message || 'Unknown Error',
      data.type
    );
  }

  return data;
}
