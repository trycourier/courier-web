import { NextResponse } from 'next/server';

/**
 * CORS configuration options
 */
export interface CorsOptions {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  maxAge?: number;
}

/**
 * Default CORS configuration
 */
const defaultCorsOptions: CorsOptions = {
  origin: '*', // Allow all origins by default
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

/**
 * Get allowed origin based on request and configuration
 */
function getAllowedOrigin(
  requestOrigin: string | null,
  configuredOrigin: string | string[] | undefined
): string {
  if (!configuredOrigin) {
    return '*';
  }

  if (typeof configuredOrigin === 'string') {
    return configuredOrigin === '*' ? '*' : configuredOrigin;
  }

  // Array of allowed origins
  if (requestOrigin && configuredOrigin.includes(requestOrigin)) {
    return requestOrigin;
  }

  // If no match and not wildcard, return first origin or '*'
  return configuredOrigin[0] || '*';
}

/**
 * Add CORS headers to a NextResponse
 */
export function addCorsHeaders(
  response: NextResponse,
  options: CorsOptions = {}
): NextResponse {
  const config = { ...defaultCorsOptions, ...options };
  const origin = getAllowedOrigin(null, config.origin);

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set(
    'Access-Control-Allow-Methods',
    config.methods?.join(', ') || 'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    config.allowedHeaders?.join(', ') || 'Content-Type, Authorization'
  );
  response.headers.set(
    'Access-Control-Max-Age',
    String(config.maxAge || 86400)
  );

  return response;
}

/**
 * Create a CORS-enabled response
 */
export function corsResponse(
  data: any,
  status: number = 200,
  options: CorsOptions = {}
): NextResponse {
  const response = NextResponse.json(data, { status });
  return addCorsHeaders(response, options);
}

/**
 * Handle preflight OPTIONS request
 */
export function handleCorsPreflight(options: CorsOptions = {}): NextResponse {
  const config = { ...defaultCorsOptions, ...options };
  const origin = getAllowedOrigin(null, config.origin);

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods':
        config.methods?.join(', ') || 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        config.allowedHeaders?.join(', ') || 'Content-Type, Authorization',
      'Access-Control-Max-Age': String(config.maxAge || 86400),
    },
  });
}

