import { NextResponse } from 'next/server';
import { getCourierClient } from '@/app/api/lib/courier';

interface MessageAction {
  content: string;
  href: string;
}

export async function POST(request: Request) {
  try {
    // Read user_id and either a template id or inline title/body, plus optional
    // data, tags, actions, api_key, and courierRest from request body
    const body = await request.json();
    const { user_id, title, body: messageBody, template, data, tags, actions, api_key, courierRest } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required in request body' },
        { status: 400 }
      );
    }

    if (!template) {
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
    }

    // Use provided api_key or fall back to environment default
    const courier = getCourierClient(courierRest, api_key);

    // Prefer a template id over inline content when provided
    let content: any;
    if (!template) {
      // Build the content - use Elemental format if actions are provided
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
    }

    // Send inbox message to the user
    const message = {
      to: {
        user_id: user_id,
      },
      ...(template ? { template } : { content }),
      ...(data && Object.keys(data).length > 0 && { data }),
      metadata: {
        tags: tags,
      },
      // Only force the inbox channel for inline content, which has no routing of
      // its own. A template carries its own routing strategy, and overriding it
      // here would mean the designer previews something other than what the
      // template actually does in production.
      ...(template
        ? {}
        : {
          routing: {
            method: 'single',
            channels: ['inbox'],
          },
        }),
    };

    // Log the exact payload we hand to the Send API. This is the thing you want
    // when a message doesn't show up the way you expect — routing, channels and
    // content as actually sent, not as intended.
    console.log(`[send] ${courierRest ?? 'default'}\n${JSON.stringify({ message }, null, 2)}`);

    const { requestId } = await courier.send.message({ message });

    console.log(`[send] accepted requestId=${requestId}`);

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

