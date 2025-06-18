import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userMessage = body.message;

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      }),
    }
  );

  const data = await geminiResponse.json();
  const interpretation =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';

  return NextResponse.json({ interpretation });
}
