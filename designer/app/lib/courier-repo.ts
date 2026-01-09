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
// When basePath is configured in Next.js, API routes are also prefixed with the basePath
function getApiBasePath(): string {
  if (typeof window === 'undefined') {
    return '/api';
  }
  // Get the current pathname
  const pathname = window.location.pathname;

  // If pathname starts with /inbox-demo, basePath is configured
  // and API routes are also at /inbox-demo/api
  if (pathname.startsWith('/inbox-demo')) {
    return '/inbox-demo/api';
  }

  // Otherwise, use root API path
  return '/api';
}

export class CourierRepo {
  async generateJWT(userId: string, apiKey?: string): Promise<JWTResponse> {
    const apiBase = getApiBasePath();
    let response = await fetch(`${apiBase}/jwt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        ...(apiKey && { api_key: apiKey }),
      }),
    });

    // If the response is not OK and we're using /inbox-demo/api, try /api as fallback
    if (!response.ok && apiBase === '/inbox-demo/api') {
      const contentType = response.headers.get('content-type');
      // If we got HTML (404 page), try the root API path
      if (contentType && contentType.includes('text/html')) {
        response = await fetch('/api/jwt', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            ...(apiKey && { api_key: apiKey }),
          }),
        });
      }
    }

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate JWT");
      } catch (e) {
        if (e instanceof Error && e.message.includes('JSON')) {
          throw new Error(`Failed to generate JWT: ${response.status} ${response.statusText}`);
        }
        throw e;
      }
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
    let response = await fetch(`${apiBase}/messages`, {
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

    // If the response is not OK and we're using /inbox-demo/api, try /api as fallback
    if (!response.ok && apiBase === '/inbox-demo/api') {
      const contentType = response.headers.get('content-type');
      // If we got HTML (404 page), try the root API path
      if (contentType && contentType.includes('text/html')) {
        response = await fetch('/api/messages', {
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
      }
    }

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      } catch (e) {
        if (e instanceof Error && e.message.includes('JSON')) {
          throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }
        throw e;
      }
    }

    return response.json();
  }
}

