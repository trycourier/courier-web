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

export class CourierRepo {
  async generateJWT(userId: string, apiKey?: string): Promise<JWTResponse> {
    const response = await fetch("/inbox-demo/api/jwt", {
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
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
      throw new Error(error.error || "Failed to generate JWT");
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Unexpected content type:', contentType, 'Response:', text);
      throw new Error(`Unexpected response format: ${contentType}`);
    }

    const data = await response.json();

    // Log for debugging
    console.log('JWT API Response:', {
      hasToken: !!data.token,
      tokenLength: data.token?.length,
      keys: Object.keys(data),
      status: response.status
    });

    if (!data.token) {
      console.error('JWT response missing token:', data);
      throw new Error('JWT response missing token');
    }

    return data;
  }

  async sendMessage(
    userId: string,
    title: string,
    body: string,
    tags?: string[],
    actions?: MessageAction[],
    apiKey?: string
  ): Promise<SendMessageResponse> {
    const response = await fetch("/inbox-demo/api/messages", {
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
