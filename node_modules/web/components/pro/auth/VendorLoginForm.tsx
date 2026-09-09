"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Store, Hammer, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, VENDOR_HOME_PATH } from "@/lib/supabase/config";

const inputClass =
  "w-full min-h-[44px] rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] px-4 py-3 font-body text-sm text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/40 focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]";

type AccountKind = "shop_with_crew" | "solo_tradesman";

const ACCOUNT_KINDS: { value: AccountKind; label: string; icon: React.ElementType }[] = [
  { value: "shop_with_crew", label: "Store Owner", icon: Store },
  { value: "solo_tradesman", label: "Independent Tradesman", icon: Hammer },
];

export function VendorLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [kind, setKind] = useState<AccountKind>("shop_with_crew");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError(
        "Sign-in is unavailable: this deployment has no Supabase project configured yet.",
      );
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Deliberately vague: never reveal whether the address has an account.
      setError("Those details do not match an active partner account.");
      setIsSubmitting(false);
      return;
    }

    // Role is read from the database after sign-in, never trusted from the
    // toggle above — that only tailors the copy.
    const next = searchParams.get("next");
    router.push(next?.startsWith("/pro") ? next : VENDOR_HOME_PATH);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {!isSupabaseConfigured && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c19]/55" />
          <p className="font-body text-sm leading-relaxed text-[#1b1c19]/65">
            No Supabase project is connected yet, so sign-in cannot complete.
            Add your credentials to <code className="font-mono text-xs">.env.local</code> to
            enable it.
          </p>
        </div>
      )}

      {/* Account kind — tailors the copy and the post-signup flow. It is not a
          permission: access always comes from the account's own record. */}
      <fieldset className="mb-6">
        <legend className="mb-2 block font-body text-sm font-medium text-[#1b1c19]">
          Account type
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ACCOUNT_KINDS.map(({ value, label, icon: Icon }) => {
            const active = kind === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setKind(value)}
                aria-pressed={active}
                className={`flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-body text-sm font-medium transition-colors duration-300 ${
                  active
                    ? "border-[#1b1c19] bg-[#1b1c19] text-[#fbf9f4]"
                    : "border-[#c4c7c7] bg-[#fbf9f4] text-[#1b1c19] hover:border-[#1b1c19] hover:bg-[#f4f0ea]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="business-email"
            className="mb-2 block font-body text-sm font-medium text-[#1b1c19]"
          >
            Business email
          </label>
          <input
            id="business-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="workshop@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="business-password"
            className="mb-2 block font-body text-sm font-medium text-[#1b1c19]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="business-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-2xl p-1.5 text-[#1b1c19]/50 transition-colors hover:text-[#1b1c19]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 font-body text-sm leading-relaxed text-[#9d3f30]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-all duration-300 hover:bg-black disabled:cursor-wait disabled:opacity-80"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
        {isSubmitting ? "Signing in" : "Sign In to Partner Portal"}
      </button>

      <p className="mt-8 text-center font-body text-sm text-[#1b1c19]/65">
        Not a partner yet?{" "}
        <Link
          href="/partners"
          className="font-medium text-[#1b1c19] underline-offset-4 transition-colors hover:underline"
        >
          Register your business
        </Link>
      </p>
    </form>
  );
}
