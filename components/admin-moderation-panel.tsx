"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Check, Eye, Loader2, X } from "lucide-react";

type ModerationRow = {
  id: string;
  cells: string[];
  detailsHref?: string;
};

export function AdminModerationPanel({
  title,
  type,
  rows
}: {
  title: string;
  type: "vendors" | "products";
  rows: ModerationRow[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const moderate = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    setError("");

    const response = await fetch(`/api/admin/${type}/${id}/${action}`, {
      method: "POST"
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Moderation failed. Please check Supabase admin credentials.");
      setBusyId(null);
      return;
    }

    router.refresh();
    setBusyId(null);
  };

  return (
    <div className="card rounded-[22px] p-6">
      <div className="flex items-center gap-3">
        <BadgeCheck className="text-[#6C3CF0]" />
        <h2 className="text-2xl font-black">{title}</h2>
      </div>

      {error ? <div className="mt-4 rounded-2xl bg-[#fff1f1] p-4 text-sm font-extrabold text-[#EF4444]">{error}</div> : null}

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#ece6ff]">
        {rows.length ? (
          rows.map((row) => (
            <div key={row.id} className="grid gap-3 border-b border-[#ece6ff] bg-white p-4 last:border-b-0 md:grid-cols-[1fr_1fr_1fr_auto]">
              {row.cells.map((cell) => (
                <p key={cell} className="text-sm font-bold text-[#454151]">{cell}</p>
              ))}
              <div className="flex gap-2">
                {row.detailsHref ? (
                  <Link href={row.detailsHref} aria-label="View details" className="grid size-10 place-items-center rounded-full border border-[#dcd1ff] bg-white text-[#6C3CF0] transition hover:bg-[#F3EEFF]">
                    <Eye size={18} />
                  </Link>
                ) : null}
                <button
                  type="button"
                  aria-label="Approve"
                  onClick={() => moderate(row.id, "approve")}
                  disabled={busyId === row.id}
                  className="grid size-10 place-items-center rounded-full bg-[#22C55E] text-white disabled:opacity-60"
                >
                  {busyId === row.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                </button>
                <button
                  type="button"
                  aria-label="Reject"
                  onClick={() => moderate(row.id, "reject")}
                  disabled={busyId === row.id}
                  className="grid size-10 place-items-center rounded-full bg-[#EF4444] text-white disabled:opacity-60"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 text-sm font-bold text-[#6B7280]">No pending records right now.</div>
        )}
      </div>
    </div>
  );
}
