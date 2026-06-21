import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { rateLimit, sweepRateLimits } from "@/lib/rate-limit";
import { contact } from "@/lib/site";

/* =========================================================================
   Contact route. Validates with Zod, checks a honeypot, rate-limits by IP,
   and only sends when a provider is configured (RESEND_API_KEY). It never
   claims delivery it cannot confirm: with no provider it returns a "fallback"
   response so the client points the user at the direct mail link.
   ========================================================================= */

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  sweepRateLimits();
  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form fields." },
      { status: 422 },
    );
  }

  const { name, email, message, company } = parsed.data;
  // Honeypot tripped, accept silently without sending.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || contact.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  // No provider configured: be honest, hand back to the mailto fallback.
  if (!apiKey || !from) {
    return NextResponse.json({
      ok: false,
      fallback: true,
      error: "Direct send is not configured. Please use the email link below.",
    });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `Open channel, ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        fallback: true,
        error: "Message could not be sent. Please use the email link below.",
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({
      ok: false,
      fallback: true,
      error: "Message could not be sent. Please use the email link below.",
    });
  }
}
