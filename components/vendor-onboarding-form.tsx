"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, FileCheck, IdCard, Store } from "lucide-react";
import { StoreAddressFields } from "@/components/store-address-fields";
import { VendorOAuthButtons } from "@/components/vendor-oauth-buttons";
import { categories } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

const steps = [
  { label: "Personal Information", icon: BadgeCheck },
  { label: "Identification", icon: IdCard },
  { label: "Store Details", icon: Store },
  { label: "Review", icon: FileCheck }
];

export function VendorOnboardingForm({ submitted }: { submitted?: string }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthUser, setOauthUser] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;

      if (!user || !formRef.current) {
        return;
      }

      setOauthUser(true);
      const ownerName = formRef.current.elements.namedItem("ownerName") as HTMLInputElement | null;
      const email = formRef.current.elements.namedItem("email") as HTMLInputElement | null;

      if (ownerName && !ownerName.value) {
        ownerName.value = String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "");
      }

      if (email && !email.value) {
        email.value = user.email ?? "";
      }
    });
  }, []);

  const validateStep = (stepToValidate: number, shouldFocus = true) => {
    const fields = formRef.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `[data-step="${stepToValidate}"][data-required="true"]`
    );

    if (!fields?.length) {
      return true;
    }

    const invalidField = Array.from(fields).find((field) => {
      if (field instanceof HTMLInputElement && field.type === "file") {
        return !field.files?.length;
      }

      return !field.value.trim();
    });

    if (invalidField) {
      setError("Please complete all required fields in this step before continuing.");
      if (shouldFocus) {
        invalidField.focus();
      }
      return false;
    }

    setError("");
    return true;
  };

  const goToStep = (targetStep: number) => {
    if (targetStep <= step) {
      setError("");
      setStep(targetStep);
      return;
    }

    if (!validateStep(step)) {
      return;
    }

    setStep(Math.min(step + 1, targetStep));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    for (let index = 0; index < steps.length - 1; index += 1) {
      if (!validateStep(index, false)) {
        setStep(index);
        return;
      }
    }

    if (!formRef.current) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/vendors/register", {
        method: "POST",
        body: new FormData(formRef.current)
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        setError(body?.error ?? "Vendor registration failed. Please try again.");
        return;
      }

      window.location.href = "/vendor/onboarding?submitted=review";
    } catch {
      setError("Vendor registration could not reach the server. Please check that the app is running and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card rounded-[24px] p-6 md:p-8">
      {submitted ? (
        <div className="mb-6 rounded-2xl bg-[#EAFBF1] p-4 text-sm font-extrabold text-[#16803E]">
          Application received. Your vendor profile is pending approval before it appears on AduraMart.
        </div>
      ) : null}

      <div>
        <div className="mb-4 h-3 overflow-hidden rounded-full bg-[#ECE6FF]">
          <div className="h-full rounded-full bg-[#6C3CF0] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              type="button"
              onClick={() => goToStep(index)}
              className={`rounded-2xl border p-3 text-left transition ${
                index === step ? "border-[#6C3CF0] bg-[#F3EEFF] text-[#6C3CF0]" : "border-[#ece6ff] bg-white text-[#6B7280]"
              }`}
            >
              <Icon size={18} />
              <span className="mt-2 block text-xs font-extrabold uppercase tracking-[0.12em]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {error ? <div className="mt-5 rounded-2xl bg-[#fff1f1] p-4 text-sm font-extrabold text-[#EF4444]">{error}</div> : null}

      <div className="mt-8">
        <StepPanel active={step === 0}>
          <PanelTitle title="Personal information" copy="Start with the owner details AduraMart will verify and use for vendor communication." />
          <VendorOAuthButtons />
          {oauthUser ? <div className="mb-5 rounded-2xl bg-[#EAFBF1] p-4 text-sm font-extrabold text-[#16803E]">Google or Apple sign-in detected. Your name and email can be reused for vendor onboarding.</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Field stepIndex={0} name="ownerName" label="Full Name" placeholder="Your legal name" />
            <Field stepIndex={0} name="email" label="Email" placeholder="vendor@example.com" type="email" />
            <Field stepIndex={0} name="phone" label="Phone Number" placeholder="+234..." />
            <Field stepIndex={0} name="whatsapp" label="WhatsApp Contact" placeholder="+234..." />
            <Field stepIndex={0} name="password" label={oauthUser ? "Password (manual signup only)" : "Password"} placeholder="Create password" type="password" required={!oauthUser} />
          </div>
        </StepPanel>

        <StepPanel active={step === 1}>
          <PanelTitle title="Identification" copy="Upload verification documents so the team can approve your store with confidence." />
          <div className="grid gap-8 md:grid-cols-2">
            <FileField stepIndex={1} name="governmentId" label="Government ID Upload" />
            <FileField stepIndex={1} name="selfie" label="Selfie Verification" />
          </div>
        </StepPanel>

        <StepPanel active={step === 2}>
          <PanelTitle title="Store details" copy="Shape your public storefront, address, and visual identity before admin review." />
          <div className="grid gap-4 md:grid-cols-2">
            <Field stepIndex={2} name="storeName" label="Store Name" placeholder="Your spiritual store" />
            <label className="grid gap-2 text-sm font-extrabold text-[#1F1F1F]">
              Primary Category
              <select name="category" data-step="2" data-required="true" className="rounded-2xl border border-[#ece6ff] bg-white px-4 py-3 font-semibold outline-none focus:border-[#6C3CF0]">
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <StoreAddressFields stepIndex={2} />
            <FileField stepIndex={2} name="banner" label="Store Banner" />
            <FileField stepIndex={2} name="logo" label="Store Logo" />
            <label className="grid gap-2 text-sm font-extrabold text-[#1F1F1F] md:col-span-2">
              Store Description
              <textarea name="description" data-step="2" data-required="true" rows={4} placeholder="Tell buyers what your store offers" className="rounded-2xl border border-[#ece6ff] bg-white px-4 py-3 font-semibold outline-none focus:border-[#6C3CF0]" />
            </label>
          </div>
        </StepPanel>

        <StepPanel active={step === 3}>
          <PanelTitle title="Review and submit" copy="Your application will be sent to the admin approval queue. Your store will not appear publicly until approved." />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Vendor identity", "Personal information and contact details"],
              ["Verification files", "Government ID and selfie checks"],
              ["Store profile", "Category, address, images, and public store description"]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-[#ece6ff] bg-white p-5">
                <BadgeCheck className="text-[#22C55E]" />
                <p className="mt-4 font-black">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">{copy}</p>
              </div>
            ))}
          </div>
          <label className="mt-6 flex gap-3 rounded-2xl border border-[#dcd1ff] bg-white p-5 text-sm font-bold leading-7 text-[#454151]">
            <input name="termsAccepted" type="checkbox" data-step="3" data-required="true" className="mt-1 size-5 shrink-0 accent-[#6C3CF0]" />
            <span>
              I have read and agree to AduraMart vendor terms, company rights, marketplace review rules, and product posting guidelines. I understand that vendors must be approved before public display and that submitted listings may be approved or rejected by AduraMart.
            </span>
          </label>
        </StepPanel>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          className="inline-flex items-center gap-2 rounded-full border border-[#dcd1ff] bg-white px-5 py-3 font-extrabold disabled:opacity-40"
          disabled={step === 0}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={() => goToStep(step + 1)} className="inline-flex items-center gap-2 rounded-full bg-[#6C3CF0] px-6 py-3 font-extrabold text-white">
            Continue
            <ArrowRight size={18} />
          </button>
        ) : (
          <button disabled={submitting} className="rounded-full bg-[#6C3CF0] px-6 py-3 font-extrabold text-white shadow-lg shadow-purple-500/25 disabled:opacity-60">
            {submitting ? "Submitting..." : "Submit for approval"}
          </button>
        )}
      </div>
    </form>
  );
}

function StepPanel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return <section className={active ? "block" : "hidden"}>{children}</section>;
}

function PanelTitle({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6B7280]">{copy}</p>
    </div>
  );
}

function Field({ label, name, placeholder, stepIndex, type = "text", required = true }: { label: string; name: string; placeholder: string; stepIndex: number; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-[#1F1F1F]">
      {label}
      <input name={name} type={type} placeholder={placeholder} data-step={stepIndex} data-required={required ? "true" : "false"} className="rounded-2xl border border-[#ece6ff] bg-white px-4 py-3 font-semibold outline-none focus:border-[#6C3CF0]" />
    </label>
  );
}

function FileField({ label, name, stepIndex }: { label: string; name: string; stepIndex: number }) {
  return (
    <label className="grid gap-4 rounded-[18px] border border-[#ece6ff] bg-white p-5 text-sm font-extrabold text-[#1F1F1F]">
      <span>{label}</span>
      <span className="block text-xs font-bold leading-6 text-[#6B7280]">
        Upload a clear file. Supported formats depend on your browser and Supabase storage settings.
      </span>
      <input name={name} type="file" data-step={stepIndex} data-required="true" className="w-full rounded-2xl border border-dashed border-[#cfc2ff] bg-[#F3EEFF] px-4 py-4 text-sm font-semibold" />
    </label>
  );
}
