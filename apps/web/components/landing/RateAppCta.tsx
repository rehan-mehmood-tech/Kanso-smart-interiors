"use client";

import React, { useEffect, useState } from "react";
import { Star, X, MessageSquarePlus, Check } from "lucide-react";

const LABELS = ["", "Needs work", "Fair", "Good", "Great", "Exceptional"];

export function RateAppCta() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape and lock background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    // Reset a little after the modal leaves so the user does not see it wipe.
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setHover(0);
      setFeedback("");
    }, 250);
  };

  const shown = hover || rating;

  return (
    <>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-2.5 rounded-2xl border border-[#1b1c19] bg-transparent px-6 py-3.5 sm:px-7 font-body text-sm font-medium text-[#1b1c19] transition-all duration-500 hover:bg-[#1b1c19] hover:text-[#fbf9f4]"
        >
          <MessageSquarePlus className="h-4 w-4 shrink-0" />
          Rate This App / Share Feedback
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rate-title"
        >
          <button
            type="button"
            aria-label="Close feedback dialog"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-[#1b1c19]/55 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-[32rem] rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] p-7 shadow-2xl sm:p-9">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 rounded-2xl p-1.5 text-[#1b1c19]/50 transition-colors hover:bg-[#f4f0ea] hover:text-[#1b1c19]"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#c4c7c7] bg-[#f4f0ea]">
                  <Check className="h-6 w-6 text-[#1b1c19]" />
                </span>
                <h3 id="rate-title" className="font-serif text-2xl text-[#1b1c19]">
                  Thank you
                </h3>
                <p className="mt-3 max-w-[24rem] font-body text-sm leading-relaxed text-[#1b1c19]/65">
                  Your feedback shapes what we build next. We read every note that
                  comes through.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-7 rounded-2xl bg-[#1b1c19] px-7 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-black"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 id="rate-title" className="pr-8 font-serif text-2xl text-[#1b1c19]">
                  How is Kanso working for you?
                </h3>
                <p className="mt-3 w-full max-w-[28rem] font-body text-sm leading-relaxed text-[#1b1c19]/65">
                  A few seconds of honesty helps us decide what to fix first.
                </p>

                <div className="mt-7 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHover(value)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                      aria-pressed={rating === value}
                      className="rounded-2xl p-1 transition-transform duration-200 hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors duration-200 ${
                          value <= shown
                            ? "fill-[#1b1c19] text-[#1b1c19]"
                            : "text-[#c4c7c7]"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 font-body text-sm whitespace-nowrap text-[#1b1c19]/60">
                    {LABELS[shown]}
                  </span>
                </div>

                <label
                  htmlFor="kanso-feedback"
                  className="mt-7 block font-body text-sm font-medium text-[#1b1c19]"
                >
                  What stood out, good or bad?
                </label>
                <textarea
                  id="kanso-feedback"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="The renders felt accurate, but I wanted more control over lighting..."
                  className="mt-2 w-full resize-none min-h-[44px] rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] px-4 py-3 font-body text-sm leading-relaxed text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/35 focus:border-[#1b1c19]"
                />

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-2xl border border-[#c4c7c7] px-6 py-3 font-body text-sm font-medium text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
                  >
                    Not now
                  </button>
                  <button
                    type="button"
                    disabled={rating === 0}
                    onClick={() => setSubmitted(true)}
                    className="rounded-2xl bg-[#1b1c19] px-7 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Submit Feedback
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
