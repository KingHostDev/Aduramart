"use client";

import { Apple, Chrome } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type OAuthProvider = "google" | "apple";

export function VendorOAuthButtons() {
  const continueWithProvider = async (provider: OAuthProvider) => {
    const supabase = createClient();

    if (!supabase) {
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/vendor/onboarding?oauth=${provider}`
      }
    });
  };

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => continueWithProvider("google")}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dcd1ff] bg-white px-4 py-3 text-sm font-extrabold text-[#1F1F1F] transition hover:bg-[#F3EEFF]"
      >
        <Chrome size={18} className="text-[#6C3CF0]" />
        Continue with Google
      </button>
      <button
        type="button"
        onClick={() => continueWithProvider("apple")}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dcd1ff] bg-white px-4 py-3 text-sm font-extrabold text-[#1F1F1F] transition hover:bg-[#F3EEFF]"
      >
        <Apple size={18} className="text-[#6C3CF0]" />
        Continue with Apple
      </button>
    </div>
  );
}
