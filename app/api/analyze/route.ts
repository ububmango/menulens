import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { image } = await req.json();

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    system: `You are a friendly food guide for Korean travelers.
When given a menu image, extract all menu items and for each item provide:
1. Original name
2. Korean translation
3. Simple description in Korean (ingredients, taste, similar Korean food)
4. Tags (e.g. 매운맛, 채식, 해산물, 고기, 디저트)

Also recommend top 3 items.

Respond ONLY in this exact JSON format with no markdown:
{
  "items": [
    {
      "original": "menu item name",
      "translated": "한국어 번역",
      "description": "음식 설명",
      "tags": ["태그1"]
    }
  ],
  "recommendations": [
    { "item": "메뉴 이름", "reason": "추천 이유" }
  ]
}`,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
        { type: "text", text: "이 메뉴판을 분석해줘" }
      ]
    }]
  });

  const text = (response.content[0] as any).text;
  const clean = text.replace(/```json|```/g, "").trim();
  const result = JSON.parse(clean);
  return NextResponse.json(result);
}
