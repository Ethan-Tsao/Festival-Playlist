// app/api/gpt-ocr/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 });
  }


  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `This is a music festival lineup poster. Extract only the artist names. If there is a B2B set, return each artist as its own entry. 
                If an artist is listed as presenting a set such as "Automhate presents vyle" or "mythm (riddim set)", keep only the artist as the entry and ignore the rest. 
                Return a pure JSON array of strings. Do not include any explanations, day groupings, or extra text — only return valid JSON, not inside a code block.`,
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI Error:', error);
      return NextResponse.json({ error: 'Failed to call OpenAI' }, { status: 500 });
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content ?? null;

    return NextResponse.json({ result: content });
  } catch (err) {
    console.error('GPT OCR route error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
