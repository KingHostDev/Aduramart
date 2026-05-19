import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { KycStatus } from "@/lib/types";

type SmileCallbackPayload = {
  ResultCode?: string;
  ResultText?: string;
  SmileJobID?: string;
  PartnerParams?: {
    job_id?: string;
    user_id?: string;
    vendor_id?: string;
  };
  result?: {
    ResultCode?: string;
    ResultText?: string;
    SmileJobID?: string;
    PartnerParams?: {
      job_id?: string;
      user_id?: string;
      vendor_id?: string;
    };
  };
};

function resolveKycStatus(payload: SmileCallbackPayload): KycStatus {
  const resultCode = payload.result?.ResultCode ?? payload.ResultCode ?? "";
  const resultText = `${payload.result?.ResultText ?? payload.ResultText ?? ""}`.toLowerCase();

  if (["0810", "1210"].includes(resultCode) || resultText.includes("approved") || resultText.includes("verified")) {
    return "verified";
  }

  if (resultText.includes("failed") || resultText.includes("rejected") || resultText.includes("declined")) {
    return "failed";
  }

  return "manual_review";
}

export async function POST(request: Request) {
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  const payload = await request.json().catch(() => null) as SmileCallbackPayload | null;

  if (!payload) {
    return NextResponse.json({ error: "Invalid Smile ID callback payload." }, { status: 400 });
  }

  const partnerParams = payload.result?.PartnerParams ?? payload.PartnerParams;
  const reference = payload.result?.SmileJobID ?? payload.SmileJobID ?? partnerParams?.job_id ?? null;
  const vendorId = partnerParams?.vendor_id ?? partnerParams?.user_id ?? null;
  const status = resolveKycStatus(payload);

  if (!vendorId && !reference) {
    return NextResponse.json({ error: "Smile ID callback does not include a vendor or job reference." }, { status: 400 });
  }

  let query = supabase
    .from("vendors")
    .update({
      kyc_status: status,
      kyc_provider: "smile_id",
      kyc_reference: reference,
      kyc_result: payload
    });

  query = vendorId ? query.eq("id", vendorId) : query.eq("kyc_reference", reference);
  const { error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, status });
}