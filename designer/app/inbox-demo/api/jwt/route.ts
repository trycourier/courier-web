import { NextResponse } from 'next/server';
import { getCourierClient } from '@/app/inbox-demo/api/lib/courier';

export async function POST(request: Request) {
  try {
    // Read user_id and optional api_key from request body
    const body = await request.json();
    const { user_id, api_key } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required in request body' },
        { status: 400 }
      );
    }

    // Generate JWT using provided api_key or fall back to environment default
    const response = await getCourierClient(api_key).auth.issueToken({
      scope: [
        `user_id:${user_id}`,
        'read:messages',
        'read:user-tokens',
        'write:user-tokens',
        'read:brands',
        'write:brands',
        'inbox:read:messages',
        'inbox:write:events',
        'read:preferences',
        'write:preferences'
      ].join(' '),
      expires_in: '7d',
    });

    // Return JWT
    return NextResponse.json({
      token: response.token,
    });
  } catch (error) {
    console.error('Error generating JWT:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate JWT',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

