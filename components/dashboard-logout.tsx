"use client";

import { LogOut } from "lucide-react";

export function DashboardLogout({ label = "Logout" }: { label?: string }) {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dcd1ff] bg-white px-4 py-3 text-sm font-extrabold text-[#6C3CF0] transition hover:bg-[#F3EEFF]"
      >
        <LogOut size={17} />
        {label}
      </button>
    </form>
  );
}
