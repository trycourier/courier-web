import { API_ENVIRONMENT_PRESETS } from "@/app/lib/api-urls";

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

export interface GenerateJWTIssueTokenOptions {
  /** JWT scope string; omitted or empty → server default scope for user_id */
  scope?: string;
  /** e.g. `7d`; omitted or empty → server default */
  expiresIn?: string;
}

export class CourierRepo {
  /**
   * Issues a JWT via the Next.js API route (server uses getCourierClient → auth.issueToken).
   * Auth key: optional `apiKey`, else server `COURIER_AUTH_TOKEN`.
   */
  async generateJWT(
    userId: string,
    apiKey?: string,
    courierRest?: string,
    issueToken?: GenerateJWTIssueTokenOptions
  ): Promise<JWTResponse> {
    const body: Record<string, string> = {
      user_id: userId,
      courierRest: courierRest || API_ENVIRONMENT_PRESETS.production.courier.rest,
    };

    if (apiKey) {
      body.api_key = apiKey;
    }

    const scope = issueToken?.scope?.trim();
    if (scope) {
      body.scope = scope;
    }

    const expiresIn = issueToken?.expiresIn?.trim();
    if (expiresIn) {
      body.expires_in = expiresIn;
    }

    const response = await fetch("/inbox-demo/api/jwt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as {
        error?: string;
        details?: string;
        message?: string;
      };
      throw new Error(
        error.message || error.details || error.error || "Failed to generate JWT"
      );
    }

    return response.json();
  }

  async sendMessage(
    userId: string,
    title: string,
    body: string,
    tags?: string[],
    actions?: MessageAction[],
    apiKey?: string,
    courierRest?: string
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
        courierRest: courierRest || API_ENVIRONMENT_PRESETS.production.courier.rest,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send message");
    }

    return response.json();
  }
}
