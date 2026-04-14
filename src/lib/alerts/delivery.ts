import { maskTelegramChatId } from "@/lib/server/persistence";
import { isTelegramConfigured, sendTelegramMessage } from "@/lib/telegram/service";

interface DeliveryTarget {
  chatId?: string | null;
  email?: string | null;
}

interface DeliverAlertInput extends DeliveryTarget {
  subject: string;
  message: string;
}

type DeliveryChannel = "telegram" | "email";

function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim();
}

function getAlertFromEmail() {
  return process.env.ALERT_FROM_EMAIL?.trim();
}

export function isEmailFallbackConfigured() {
  return Boolean(getResendApiKey() && getAlertFromEmail());
}

export async function sendFallbackEmail(to: string, subject: string, message: string): Promise<void> {
  const apiKey = getResendApiKey();
  const from = getAlertFromEmail();
  if (!apiKey || !from || !to.trim()) {
    throw new Error("Email fallback is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: message,
    }),
  });

  if (!response.ok) {
    const payload = await response.text().catch(() => "");
    throw new Error(`Fallback email failed (${response.status}): ${payload || "Unknown error"}`);
  }
}

export async function deliverAlert(input: DeliverAlertInput): Promise<{
  channel: DeliveryChannel;
}> {
  const errors: string[] = [];

  if (input.chatId && isTelegramConfigured()) {
    try {
      await sendTelegramMessage(input.chatId, input.message);
      return { channel: "telegram" };
    } catch (error) {
      errors.push(
        `Telegram [${maskTelegramChatId(input.chatId)}]: ${error instanceof Error ? error.message : "Unknown delivery error"}`
      );
    }
  }

  if (input.email && isEmailFallbackConfigured()) {
    try {
      await sendFallbackEmail(input.email, input.subject, input.message);
      return { channel: "email" };
    } catch (error) {
      errors.push(
        `Email: ${error instanceof Error ? error.message : "Unknown delivery error"}`
      );
    }
  }

  if (errors.length === 0) {
    throw new Error("No available delivery channel is configured.");
  }

  throw new Error(errors.join(" | "));
}
