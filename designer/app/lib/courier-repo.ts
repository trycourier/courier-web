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
function getApiBasePath(): string {
  if (typeof window === 'undefined') {
    return '/api';
  }
  // Get the current pathname
  const pathname = window.location.pathname;
  // If pathname starts with /inbox-demo, use that as base, otherwise use root
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

