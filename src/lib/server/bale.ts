import "server-only";

import { type ContactInput } from "@/lib/contact-schema";

const TIMEOUT_MS = 8_000;

// Bale speaks the Telegram Bot API; Telegram itself is filtered on the server, so Bale is the channel
export function formatMessage(input: ContactInput): string {
  return [
    "✉️ پیام تازه از alimor.ir",
    "",
    `👤 ${input.name}`,
    `📮 ${input.reply}`,
    `🌐 زبان صفحه: ${input.locale}`,
    "",
    "💬 پیام:",
    input.message,
  ].join("\n");
}

export async function sendToBale(text: string): Promise<boolean> {
  const base = process.env.NOTIFY_BOT_API_BASE ?? "https://tapi.bale.ai";
  const token = process.env.NOTIFY_BOT_TOKEN;
  const chatId = process.env.NOTIFY_CHAT_ID;
  if (!token || !chatId) {
    console.error("contact: NOTIFY_BOT_TOKEN or NOTIFY_CHAT_ID is not set");
    return false;
  }
  try {
    const response = await fetch(`${base}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) console.error(`contact: bot answered ${response.status}`);
    return response.ok;
  } catch (e: unknown) {
    console.error("contact: bot request failed", e instanceof Error ? e.message : e);
    return false;
  }
}
