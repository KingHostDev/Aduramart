"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";

function getVisitorKey() {
  const existing = window.localStorage.getItem("aduramart_visitor_key");
  if (existing) {
    return existing;
  }

  const next = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem("aduramart_visitor_key", next);
  return next;
}

export function VendorLikeButton({ vendorId, initialLikes }: { vendorId: string; initialLikes: number }) {
  const storageKey = useMemo(() => `aduramart_vendor_like_${vendorId}`, [vendorId]);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLiked(window.localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  async function toggleLike() {
    if (busy) return;

    const nextLiked = !liked;
    setBusy(true);
    setLiked(nextLiked);
    setLikes((value) => Math.max(0, value + (nextLiked ? 1 : -1)));

    try {
      const response = await fetch(`/api/vendors/${vendorId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorKey: getVisitorKey(), shouldLike: nextLiked })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update like");
      }

      window.localStorage.setItem(storageKey, String(data.liked));
      setLiked(data.liked);
      setLikes(data.likes);
    } catch {
      setLiked(!nextLiked);
      setLikes((value) => Math.max(0, value + (nextLiked ? -1 : 1)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={busy}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 font-extrabold transition ${liked ? "border-[#6C3CF0] bg-[#6C3CF0] text-white shadow-lg shadow-purple-500/20" : "border-[#dcd1ff] bg-white text-[#6C3CF0] hover:bg-[#F3EEFF]"}`}
      aria-pressed={liked}
    >
      <Heart size={18} fill={liked ? "currentColor" : "none"} />
      {likes.toLocaleString()} likes
    </button>
  );
}