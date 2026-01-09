export interface JWTResponse {
  token: string;
}

export interface SendMessageResponse {
  success: boolean;
  requestId: string;
  message: string;
  user_id: string;
}

export interface MessageAction {
  content: string;
  href: string;
}

// Helper function to get the API base path
// Tries to detect if basePath is configured by checking if we're at the root domain
function getApiBasePath(): string {
  if (typeof window === 'undefined') {
    return '/api';
  }
  // Get the current pathname and hostname
  const pathname = window.location.pathname;
  const hostname = window.location.hostname;

  // If we're on a subdomain (like inbox-demo.courier.com), basePath is likely configured
  // If we're on the root domain (www.courier.com), basePath might not be configured
  // Check if hostname is the root domain (www.courier.com or courier.com)
  const isRootDomain = hostname === 'www.courier.com' || hostname === 'courier.com';

  // If we're on root domain and pathname starts with /inbox-demo, 
  // the API routes are likely at /api (not /inbox-demo/api)
  if (isRootDomain && pathname.startsWith('/inbox-demo')) {
    return '/api';
  }

  // Otherwise, if pathname starts with /inbox-demo, use that as base
  if (pathname.startsWith('/inbox-demo')) {
    return '/inbox-demo/api';
  }

  return '/api';
}

export class CourierRepo {
  async generateJWT(userId: string, apiKey?: string): Promise<JWTResponse> {
    const apiBase = getApiBasePath();
    const response = await fetch(`${apiBase}/jwt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        ...(apiKey && { api_key: apiKey }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate JWT");
    }

    return response.json();
  }

  async sendMessage(
    userId: string,
    title: string,
    body: string,
    tags?: string[],
    actions?: MessageAction[],
    apiKey?: string
  ): Promise<SendMessageResponse> {
    const apiBase = getApiBasePath();
    const response = await fetch(`${apiBase}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        title,
        body,
        tags,
        actions,
        ...(apiKey && { api_key: apiKey }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send message");
    }

    return response.json();
  }
}

