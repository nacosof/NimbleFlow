import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { chatCompletion } from "@/lib/ai";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().trim().min(1).max(8000),
      }),
    )
    .min(1)
    .max(40),
  model: z.string().trim().min(1).max(120).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректное тело запроса" },
      { status: 400 },
    );
  }

  try {
    const result = await chatCompletion(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось получить ответ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
