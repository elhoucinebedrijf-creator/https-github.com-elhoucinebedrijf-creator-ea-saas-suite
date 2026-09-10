import type { ProductKey } from "@/lib/products";

type DispatchPayload = {
  product: ProductKey;
  event: string;
  path?: string;
  recordId?: string;
  payload: Record<string, unknown>;
};

export async function dispatchWorkflow(input: DispatchPayload) {
  const baseUrl = process.env.N8N_BASE_URL;
  const secret = process.env.N8N_SHARED_SECRET;

  if (!baseUrl || !secret) {
    return { skipped: true, reason: "N8N_BASE_URL or N8N_SHARED_SECRET is not configured" };
  }

  const webhookPath = input.path ?? "ea-suite";
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/webhook/${webhookPath}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-ea-signature": secret,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      return { skipped: false, ok: false, status: response.status };
    }

    return { skipped: false, ok: true };
  } catch (error) {
    return {
      skipped: false,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown workflow dispatch error",
    };
  }
}
