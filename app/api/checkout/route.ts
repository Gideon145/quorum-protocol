import { NextRequest, NextResponse } from "next/server";
import type { Tier } from "@/lib/types";
import { TIERS } from "@/lib/types";

const LOCUS_BASE =
  process.env.LOCUS_API_BASE ?? "https://beta-api.paywithlocus.com/api";
const LOCUS_KEY = process.env.LOCUS_API_KEY ?? "";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://svc-mo84e57ac8gebo8k.buildwithlocus.com";

export async function POST(req: NextRequest) {
  let tier: Tier;
  let description: string;

  try {
    const body = await req.json();
    tier = body.tier as Tier;
    description = body.description as string;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!tier || !(tier in TIERS)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }
  if (!description || typeof description !== "string" || description.trim().length < 5) {
    return NextResponse.json({ error: "Missing description" }, { status: 400 });
  }

  const config = TIERS[tier];

  try {
    const res = await fetch(`${LOCUS_BASE}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOCUS_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: config.amount,
        description: `${config.label} — Quorum Protocol`,
        successUrl: `${APP_URL}/run?idea=${encodeURIComponent(description.trim())}&tier=${tier}&paid=true`,
        cancelUrl: `${APP_URL}/run`,
        metadata: {
          tier,
          idea: description.trim().slice(0, 200),
        },
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message ?? data.error ?? `Locus checkout error (${res.status})`);
    }

    const sessionId: string = data.data?.id ?? data.data?.sessionId;
    if (!sessionId) throw new Error("No session ID in Locus response");

    return NextResponse.json({
      sessionId,
      checkoutUrl: `https://beta-checkout.paywithlocus.com/${sessionId}`,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Checkout session creation failed";
    console.error("[checkout]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
