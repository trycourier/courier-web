import { NextResponse } from 'next/server';
import { getCourierClient } from '@/app/api/lib/courier';

export async function POST(request: Request) {
  try {
    // Read user_id, title, body, optional tags, and optional api_key from request body
    const body = await request.json();
    const { user_id, title, body: messageBody, tags, api_key } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required in request body' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'title is required in request body' },
        { status: 400 }
      );
    }

    if (!messageBody) {
      return NextResponse.json(
        { error: 'body is required in request body' },
        { status: 400 }
      );
    }

    // Use provided api_key or fall back to environment default
    const courier = getCourierClient(api_key);

    // Send inbox message to the user
    const { requestId } = await courier.send.message({
      message: {
        to: {
          user_id: user_id,
        },
        content: {
          title: title,
          body: messageBody,
        },
        metadata: {
          tags: tags,
        },
        routing: {
          method: 'single',
          channels: ['inbox'],
        },
      },
    });

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Inbox message sent successfully',
      user_id,
    });
  } catch (error) {
    console.error('Error sending inbox message:', error);
    return NextResponse.json(
      {
        error: 'Failed to send inbox message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

