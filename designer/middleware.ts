import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Get allowed origin from environment variable or default to '*'
 * You can set ALLOWED_ORIGINS in your .env file as a comma-separated list
 * Example: ALLOWED_ORIGINS=http://localhost:3000,https://example.com
 */
function getAllowedOrigin(requestOrigin: string | null): string {
  const allowedOrigins = process.env.ALLOWED_ORIGINS;
  
  // If no environment variable is set, allow all origins
  if (!allowedOrigins) {
    return '*';
  }

  // Parse comma-separated origins
  const origins = allowedOrigins.split(',').map((origin) => origin.trim());
  
  // If wildcard is specified, allow all
  if (origins.includes('*')) {
    return '*';
  }

  // If request origin matches any allowed origin, return it
  if (requestOrigin && origins.includes(requestOrigin)) {
    return requestOrigin;
  }

  // Default to first allowed origin if no match
  return origins[0] || '*';
}

export function middleware(request: NextRequest) {
  // Only apply CORS to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigin = getAllowedOrigin(origin);

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400', // 24 hours
        },
      });
    }

    // For actual requests, add CORS headers to the response
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

