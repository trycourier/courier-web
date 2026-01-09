import { NextResponse } from 'next/server';
import { getCourierClient } from '@/app/api/lib/courier';

interface MessageAction {
  content: string;
  href: string;
}

export async function POST(request: Request) {
  try {
    // Read user_id, title, body, optional tags, optional actions, and optional api_key from request body
    const body = await request.json();
    const { user_id, title, body: messageBody, tags, actions, api_key } = body;

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

    // Build the content - use Elemental format if actions are provided
    let content: any;
    if (actions && Array.isArray(actions) && actions.length > 0) {
      // Use Elemental content format to include actions
      const elements: any[] = [
        { type: 'meta', title: title },
        { type: 'text', content: messageBody },
      ];
      
      // Add action elements
      actions.forEach((action: MessageAction) => {
        if (action.content && action.href) {
          elements.push({
            type: 'action',
            content: action.content,
            href: action.href,
          });
        }
      });
      
      content = {
        version: '2022-01-01',
        elements,
      };
    } else {
      // Use simple title/body format when no actions
      content = {
        title: title,
        body: messageBody,
      };
    }

    // Send inbox message to the user
    const { requestId } = await courier.send.message({
      message: {
        to: {
          user_id: user_id,
        },
        content,
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

