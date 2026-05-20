"use client";

import { createClient } from "@/lib/supabase/client";

type OAuthProvider = "google" | "apple";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#111111" d="M16.37 1.43c0 1.14-.46 2.22-1.2 3.04-.8.9-2.14 1.58-3.24 1.49-.14-1.09.42-2.26 1.16-3.08.82-.91 2.24-1.58 3.28-1.45zM20.5 17.2c-.58 1.34-.86 1.94-1.6 3.12-1.04 1.6-2.5 3.6-4.32 3.62-1.62.02-2.04-1.06-4.24-1.05-2.2.01-2.66 1.08-4.28 1.05-1.82-.02-3.2-1.82-4.24-3.42C-1.08 15.98.54 9.72 4.24 9.5c1.84-.11 3.16 1.22 4.24 1.22 1.06 0 3.04-1.51 5.12-1.29.87.04 3.32.35 4.9 2.65-.13.08-2.92 1.71-2.89 5.08.03 4.02 3.53 5.36 3.89 5.48z" />
    </svg>
  );
}

export function VendorOAuthButtons({ variant = "light" }: { variant?: "light" | "dark" }) {
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

  const buttonClass = variant === "dark"
    ? "inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white px-4 py-3 text-sm font-extrabold text-[#111111] shadow-lg shadow-black/20 transition hover:bg-white/90"
    : "inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dcd1ff] bg-white px-4 py-3 text-sm font-extrabold text-[#1F1F1F] transition hover:bg-[#F3EEFF]";

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2">
      <button type="button" onClick={() => continueWithProvider("google")} className={buttonClass}>
        <GoogleLogo />
        Continue with Google
      </button>
      <button type="button" onClick={() => continueWithProvider("apple")} className={buttonClass}>
        <AppleLogo />
        Continue with Apple
      </button>
    </div>
  );
}