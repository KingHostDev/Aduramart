"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, EyeOff, Loader2, RotateCcw, ShieldOff, Trash2, X } from "lucide-react";
import type { ApprovalStatus } from "@/lib/types";

type AdminAction = "approve" | "reject" | "hide" | "suspend" | "restore" | "delete";

export function AdminDecisionButtons({
  type,
  id,
  status = "pending"
}: {
  type: "vendors" | "products";
  id: string;
  status?: ApprovalStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<AdminAction | null>(null);
  const [error, setError] = useState("");

  const moderate = async (action: AdminAction) => {
    setBusy(action);
    setError("");

    const response = await fetch(`/api/admin/${type}/${id}/${action}`, {
      method: "POST"
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Moderation failed. Please try again.");
      setBusy(null);
      return;
    }

    router.push(type === "vendors" ? "/admin/vendors" : "/admin/products");
    router.refresh();
  };

  if (type === "products") {
    return (
      <ActionShell error={error}>
        <ActionButton label="Approve listing" action="approve" busy={busy} icon={<Check size={18} />} onClick={moderate} className="bg-[#22C55E] text-white" />
        <ActionButton label="Reject listing" action="reject" busy={busy} icon={<X size={18} />} onClick={moderate} className="border border-[#fecaca] bg-white text-[#EF4444] hover:bg-[#fff1f1]" />
      </ActionShell>
    );
  }

  const isApproved = status === "approved";
  const isHidden = status === "hidden";
  const isSuspended = status === "suspended";

  return (
    <ActionShell error={error}>
      {status !== "approved" ? (
        <ActionButton label="Approve vendor" action="approve" busy={busy} icon={<Check size={18} />} onClick={moderate} className="bg-[#22C55E] text-white" />
      ) : null}
      {isHidden || isSuspended ? (
        <ActionButton label="Restore profile" action="restore" busy={busy} icon={<RotateCcw size={18} />} onClick={moderate} className="bg-[#6C3CF0] text-white" />
      ) : null}
      {isApproved ? (
        <ActionButton label="Hide profile" action="hide" busy={busy} icon={<EyeOff size={18} />} onClick={moderate} className="border border-[#dcd1ff] bg-white text-[#6C3CF0] hover:bg-[#F3EEFF]" />
      ) : null}
      {!isSuspended ? (
        <ActionButton label="Suspend posting" action="suspend" busy={busy} icon={<ShieldOff size={18} />} onClick={moderate} className="border border-[#fed7aa] bg-white text-[#B96312] hover:bg-[#FFF1DF]" />
      ) : null}
      {status !== "rejected" ? (
        <ActionButton label="Remove vendor" action="reject" busy={busy} icon={<Trash2 size={18} />} onClick={moderate} className="border border-[#fecaca] bg-white text-[#EF4444] hover:bg-[#fff1f1]" />
      ) : null}
    </ActionShell>
  );
}

function ActionShell({ error, children }: { error: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3">
      {error ? <div className="rounded-2xl bg-[#fff1f1] p-4 text-sm font-extrabold text-[#EF4444]">{error}</div> : null}
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function ActionButton({
  label,
  action,
  busy,
  icon,
  onClick,
  className
}: {
  label: string;
  action: AdminAction;
  busy: AdminAction | null;
  icon: React.ReactNode;
  onClick: (action: AdminAction) => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(action)}
      disabled={busy !== null}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-extrabold transition disabled:opacity-60 ${className}`}
    >
      {busy === action ? <Loader2 size={18} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}
