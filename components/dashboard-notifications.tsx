"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BellRing, CheckCheck, MessageCircle } from "lucide-react";

type Item = {
  id: string;
  title: string;
  body: string;
  href: string;
  unread: boolean;
};

export function DashboardNotifications({ showMessages = true }: { showMessages?: boolean }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/dashboard/notifications", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (mounted) setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {
        if (mounted) setItems([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const unreadCount = useMemo(() => items.filter((item) => item.unread && !readIds.includes(item.id)).length, [items, readIds]);
  const messageCount = useMemo(() => items.filter((item) => item.id.includes("messages") && !readIds.includes(item.id)).length, [items, readIds]);

  function markAllRead() {
    setReadIds(items.map((item) => item.id));
  }

  return (
    <div className="relative flex items-center gap-2">
      {showMessages ? (
        <Link href={items.find((item) => item.id.includes("messages"))?.href ?? "/vendor/dashboard/messages"} className="dashboard-icon-button" aria-label="Open messages">
          <MessageCircle size={18} />
          {messageCount > 0 ? <span className="dashboard-icon-dot">{messageCount}</span> : null}
        </Link>
      ) : null}
      <button type="button" onClick={() => setOpen((value) => !value)} className="dashboard-icon-button" aria-label="Open notifications" aria-expanded={open}>
        <BellRing size={18} />
        {unreadCount > 0 ? <span className="dashboard-icon-dot">{unreadCount}</span> : null}
      </button>
      {open ? (
        <div className="dashboard-notification-popover">
          <div className="flex items-center justify-between gap-3 border-b border-[#ece6ff] p-4">
            <div>
              <p className="text-sm font-black text-[#1F1F1F]">Notifications</p>
              <p className="text-xs font-bold text-[#6B7280]">Live dashboard updates</p>
            </div>
            <button type="button" onClick={markAllRead} className="inline-flex items-center gap-2 rounded-full bg-[#F3EEFF] px-3 py-2 text-xs font-extrabold text-[#6C3CF0]"><CheckCheck size={14} />Mark all read</button>
          </div>
          <div className="grid max-h-[360px] gap-2 overflow-y-auto p-3">
            {items.length ? items.map((item) => {
              const isRead = readIds.includes(item.id);
              return (
                <Link key={item.id} href={item.href} className={`rounded-2xl border p-3 transition hover:bg-[#F3EEFF] ${isRead ? "border-[#ece6ff] bg-white" : "border-[#dcd1ff] bg-[#fbf9ff]"}`} onClick={() => setOpen(false)}>
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block text-sm font-black text-[#1F1F1F]">{item.title}</span>
                      <span className="mt-1 block text-xs font-bold leading-5 text-[#6B7280]">{item.body}</span>
                    </span>
                    {!isRead ? <span className="mt-1 size-2 shrink-0 rounded-full bg-[#6C3CF0]" /> : null}
                  </span>
                </Link>
              );
            }) : <p className="rounded-2xl bg-[#fbf9ff] p-4 text-sm font-bold text-[#6B7280]">No new notifications right now.</p>}
          </div>
        </div>
      ) : null}
    </div>
  );
}