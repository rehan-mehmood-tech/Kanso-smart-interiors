"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { AuthFooter } from "./AuthFooter";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full min-h-[44px] rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] px-4 py-3 font-body text-sm text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/40 focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Where to land after signing in.
   *
   * Only a path on this site is accepted. Following an arbitrary `next` value
   * would make this form an open redirect -- a phishing link could send a user
   * here, have them log in for real, then bounce them to a lookalike site.
   */
  const nextPath = (() => {
    const raw = searchParams.get("next");
    if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
    return raw;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Sign-in is unavailable right now. Please try again shortly.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (signInError) {
      // Deliberately generic, per PRD s10.3: never reveal which field was
      // wrong, or whether the account exists.
      setError("Invalid email or password.");
      return;
    }

    router.push(nextPath);
    // The layout reads the session on the server, so refresh to pick it up.
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-body text-sm font-medium text-[#1b1c19]"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block font-body text-sm font-medium text-[#1b1c19]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
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
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 shrink-0 rounded-sm border-[#c4c7c7] accent-[#1b1c19]"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 cursor-pointer font-body text-sm whitespace-nowrap text-[#1b1c19]/65"
          >
            Remember me
          </label>
        </div>
        <a
          href="#"
          className="font-body text-sm font-medium whitespace-nowrap text-[#1b1c19] transition-colors hover:text-[#1b1c19]/65"
        >
          Forgot password?
        </a>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 w-full font-body text-xs leading-relaxed text-[#ba1a1a]"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 min-h-[44px] w-full rounded-2xl bg-[#1b1c19] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Signing in…" : "Sign In"}
      </button>

      <div className="relative py-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#c4c7c7]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#fbf9f4] px-3 font-body text-[11px] tracking-[0.16em] whitespace-nowrap text-[#1b1c19]/50 uppercase">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] px-6 py-3 font-body text-sm font-medium text-[#1b1c19] transition-all duration-300 hover:border-[#1b1c19] hover:bg-[#f4f0ea]"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <AuthFooter mode="login" />
    </form>
  );
}
