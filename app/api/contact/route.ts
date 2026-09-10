import { NextRequest, NextResponse } from "next/server";
import { insertIfConfigured } from "@/lib/server/audit";

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Alle velden zijn verplicht." }, { status: 400 });
  }

  await insertIfConfigured("ea_support_messages", {
    name: String(name),
    email: String(email),
    message: String(message),
    status: "new",
  });

  return NextResponse.json({ ok: true });
}
