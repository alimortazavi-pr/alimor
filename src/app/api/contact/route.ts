import { contactSchema } from "@/lib/contact-schema";
import { formatMessage, sendToBale } from "@/lib/server/bale";
import { allow, clientKey } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });
  // A filled honeypot gets a quiet success, so the bot learns nothing
  if (parsed.data.website) return Response.json({ ok: true });
  if (!allow(clientKey(request.headers)))
    return Response.json({ error: "limited" }, { status: 429 });

  const sent = await sendToBale(formatMessage(parsed.data));
  return sent ? Response.json({ ok: true }) : Response.json({ error: "failed" }, { status: 502 });
}
