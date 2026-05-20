"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, FileCheck, IdCard, Store } from "lucide-react";
import { StoreAddressFields } from "@/components/store-address-fields";
import { VendorOAuthButtons } from "@/components/vendor-oauth-buttons";
import { categories } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

const steps = [
  { label: "Account", copy: "Owner details", icon: BadgeCheck },
  { label: "Identity", copy: "ID and selfie", icon: IdCard },
  { label: "Store", copy: "Public profile", icon: Store },
  { label: "Review", copy: "Final consent", icon: FileCheck }
];

export function VendorOnboardingForm({ submitted }: { submitted?: string }) {
  const [step, setStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [oauthUser, setOauthUser] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const progress = useMemo(() => ((completedSteps.length + (completedSteps.includes(step) ? 0 : 1)) / steps.length) * 100, [completedSteps, step]);

  useEffect(() => {
    const supabase = createClient();

    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user || !formRef.current) return;

      setOauthUser(true);
      const ownerName = formRef.current.elements.namedItem("ownerName") as HTMLInputElement | null;
      const email = formRef.current.elements.namedItem("email") as HTMLInputElement | null;

      if (ownerName && !ownerName.value) ownerName.value = String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "");
      if (email && !email.value) email.value = user.email ?? "";
    });
  }, []);

  const markCompleted = (index: number) => {
    setCompletedSteps((current) => Array.from(new Set([...current, index])));
  };

  const validateStep = (stepToValidate: number, shouldFocus = true) => {
    const fields = formRef.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[data-step="${stepToValidate}"][data-required="true"]`);

    if (!fields?.length) return true;

    const invalidField = Array.from(fields).find((field) => {
      if (field instanceof HTMLInputElement && field.type === "file") return !field.files?.length;
      if (field instanceof HTMLInputElement && field.type === "checkbox") return !field.checked;
      return !field.value.trim();
    });

    if (invalidField) {
      setError("Complete this step before moving forward.");
      if (shouldFocus) invalidField.focus();
      return false;
    }

    setError("");
    markCompleted(stepToValidate);
    return true;
  };

  const goToStep = (targetStep: number) => {
    if (targetStep <= step) {
      setError("");
      setStep(targetStep);
      return;
    }

    if (!validateStep(step)) return;
    setStep(Math.min(step + 1, targetStep));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    for (let index = 0; index < steps.length; index += 1) {
      if (!validateStep(index, false)) {
        setStep(index);
        return;
      }
    }

    if (!formRef.current) return;

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
      setError("Vendor registration could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="overflow-hidden rounded-[28px] border border-white/10 bg-black text-white shadow-2xl shadow-black/30">
      <div className="grid min-h-[720px] lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative overflow-hidden border-b border-white/10 p-6 md:p-9 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(174,93,255,0.82),transparent_30rem),radial-gradient(circle_at_82%_72%,rgba(21,151,125,0.72),transparent_28rem),linear-gradient(145deg,#09070f,#151017_58%,#051d19)]" />
          <div className="absolute inset-0 bg-black/18 backdrop-blur-[1px]" />
          <div className="relative z-10 flex min-h-full flex-col justify-between gap-10">
            <Link href="/" className="inline-flex w-fit items-center gap-3 text-white">
              <span className="grid size-10 place-items-center rounded-2xl bg-white text-[#6C3CF0]"><Store size={20} /></span>
              <span className="text-xl font-extrabold">AduraMart</span>
            </Link>

            <div>
              <p className="text-sm font-bold text-white/72">Vendor onboarding</p>
              <h1 className="mt-3 max-w-sm text-4xl font-extrabold leading-tight tracking-normal">Get started with us</h1>
              <p className="mt-4 max-w-xs text-sm font-semibold leading-7 text-white/68">Create your store profile and enter the AduraMart review queue.</p>
              {submitted ? <div className="mt-6 rounded-2xl bg-white p-4 text-sm font-extrabold text-[#16803E]">Application received. Your store is pending approval.</div> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {steps.map(({ label, copy, icon: Icon }, index) => {
                const completed = completedSteps.includes(index);
                const active = step === index;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => goToStep(index)}
                    className={`min-h-28 rounded-2xl border p-4 text-left transition duration-300 ${completed ? "border-white bg-white text-[#111111] blur-0" : active ? "border-white/70 bg-white/18 text-white blur-0" : "border-white/10 bg-white/10 text-white/62 blur-[0.35px] hover:bg-white/14"}`}
                  >
                    <span className={`grid size-8 place-items-center rounded-full text-xs font-extrabold ${completed ? "bg-[#111111] text-white" : "bg-white/16 text-white"}`}>
                      {completed ? <Check size={15} /> : index + 1}
                    </span>
                    <Icon size={17} className="mt-5" />
                    <span className="mt-3 block text-sm font-extrabold">{label}</span>
                    <span className={`mt-1 block text-xs font-semibold ${completed ? "text-black/56" : "text-white/48"}`}>{copy}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="bg-black p-6 md:p-10">
          <div className="mx-auto flex min-h-full max-w-xl flex-col justify-center">
            <div className="mb-7">
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white/48">Step {step + 1} of {steps.length}</p>
                  <h2 className="mt-1 text-2xl font-extrabold">{steps[step].label}</h2>
                </div>
                <Link href="/vendor-login" className="text-sm font-bold text-white/66 transition hover:text-white">Sign in</Link>
              </div>
            </div>

            {error ? <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-bold text-red-200">{error}</div> : null}

            <StepPanel active={step === 0}>
              <PanelTitle title="Sign up account" copy="Enter your vendor account details." />
              <VendorOAuthButtons variant="dark" />
              {oauthUser ? <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-200">Social sign-in detected. Continue your vendor profile.</div> : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field stepIndex={0} name="ownerName" label="Full Name" placeholder="Your legal name" />
                <Field stepIndex={0} name="email" label="Email" placeholder="vendor@example.com" type="email" />
                <Field stepIndex={0} name="phone" label="Phone" placeholder="+234..." />
                <Field stepIndex={0} name="whatsapp" label="WhatsApp" placeholder="+234..." />
                <Field stepIndex={0} name="password" label={oauthUser ? "Password (manual only)" : "Password"} placeholder="Create password" type="password" required={!oauthUser} className="sm:col-span-2" />
              </div>
            </StepPanel>

            <StepPanel active={step === 1}>
              <PanelTitle title="Verify identity" copy="Add the essentials for admin verification." />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-bold text-white/76">
                  ID Type
                  <select name="idType" data-step="1" data-required="true" className={inputClass}>
                    <option value="NIN">National Identity Number</option>
                    <option value="PASSPORT">International Passport</option>
                    <option value="DRIVERS_LICENSE">Driver's License</option>
                    <option value="VOTER_ID">Voter ID</option>
                  </select>
                </label>
                <Field stepIndex={1} name="idNumber" label="ID Number" placeholder="Enter ID number" />
                <Field stepIndex={1} name="dateOfBirth" label="Date of Birth" placeholder="YYYY-MM-DD" type="date" />
                <FileField stepIndex={1} name="governmentId" label="Government ID" />
                <FileField stepIndex={1} name="selfie" label="Selfie" />
              </div>
            </StepPanel>

            <StepPanel active={step === 2}>
              <PanelTitle title="Set up your store" copy="This becomes your public vendor profile after approval." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field stepIndex={2} name="storeName" label="Store Name" placeholder="Your spiritual store" />
                <label className="grid gap-2 text-xs font-bold text-white/76">
                  Category
                  <select name="category" data-step="2" data-required="true" className={inputClass}>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <StoreAddressFields stepIndex={2} theme="dark" />
                <FileField stepIndex={2} name="banner" label="Store Banner" />
                <FileField stepIndex={2} name="logo" label="Store Logo" />
                <label className="grid gap-2 text-xs font-bold text-white/76 sm:col-span-2">
                  Store Bio
                  <textarea name="description" data-step="2" data-required="true" rows={4} placeholder="Tell buyers what your store offers" className={inputClass} />
                </label>
              </div>
            </StepPanel>

            <StepPanel active={step === 3}>
              <PanelTitle title="Review and submit" copy="Your application enters admin approval." />
              <div className="grid gap-3 sm:grid-cols-3">
                {["Account", "Identity", "Store"].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <Check className="text-emerald-300" size={18} />
                    <p className="mt-4 text-sm font-extrabold">{label}</p>
                    <p className="mt-1 text-xs font-semibold text-white/44">{completedSteps.includes(index) ? "Complete" : "Ready"}</p>
                  </div>
                ))}
              </div>
              <label className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-semibold leading-7 text-white/76">
                <input name="termsAccepted" type="checkbox" data-step="3" data-required="true" className="mt-1 size-5 shrink-0 accent-[#6C3CF0]" />
                <span>I agree to AduraMart vendor terms, company rights, marketplace review rules, and product posting guidelines.</span>
              </label>
            </StepPanel>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-extrabold text-white/76 transition hover:bg-white/8 disabled:opacity-35">
                <ArrowLeft size={17} /> Back
              </button>
              {step < steps.length - 1 ? (
                <button type="button" onClick={() => goToStep(step + 1)} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-black transition hover:bg-white/86">
                  Continue <ArrowRight size={17} />
                </button>
              ) : (
                <button disabled={submitting} className="rounded-full bg-white px-6 py-3 text-sm font-extrabold text-black transition hover:bg-white/86 disabled:opacity-60">
                  {submitting ? "Submitting..." : "Submit for approval"}
                </button>
              )}
            </div>

            <p className="mt-6 text-center text-sm font-semibold text-white/44">
              Already have a vendor account? <Link href="/vendor-login" className="text-white hover:underline">Sign in</Link>
            </p>
          </div>
        </section>
      </div>
    </form>
  );
}

const inputClass = "rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 font-semibold text-white outline-none placeholder:text-white/35 focus:border-white/32";

function StepPanel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return <section className={active ? "block" : "hidden"}>{children}</section>;
}

function PanelTitle({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-2xl font-extrabold">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-white/46">{copy}</p>
    </div>
  );
}

function Field({ label, name, placeholder, stepIndex, type = "text", required = true, className = "" }: { label: string; name: string; placeholder: string; stepIndex: number; type?: string; required?: boolean; className?: string }) {
  return (
    <label className={`grid gap-2 text-xs font-bold text-white/76 ${className}`}>
      {label}
      <input name={name} type={type} placeholder={placeholder} data-step={stepIndex} data-required={required ? "true" : "false"} className={inputClass} />
    </label>
  );
}

function FileField({ label, name, stepIndex }: { label: string; name: string; stepIndex: number }) {
  return (
    <label className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-xs font-bold text-white/76">
      <span>{label}</span>
      <input name={name} type="file" data-step={stepIndex} data-required="true" className="w-full text-xs font-semibold text-white/58 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-extrabold file:text-black" />
    </label>
  );
}