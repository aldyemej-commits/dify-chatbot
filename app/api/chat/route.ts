import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, conversationId } = await req.json();

  const response = await fetch(`${process.env.DIFY_API_URL}/chat-messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: {},
      query: message,
      response_mode: 'blocking',
      user: 'user-001',
      conversation_id: conversationId || '',
    }),
  });

  const data = await response.json();
  return NextResponse.json({
    answer: data.answer,
    conversationId: data.conversation_id,
  });
}