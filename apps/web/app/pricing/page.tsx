import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Pricing — Kanso Smart Interiors",
  description:
    "Start with free spatial render credits. Upgrade for unlimited concepts, full material specifications, and priority artisan matching.",
};

const TIERS = [
  {
    name: "Explore",
    price: "Free",
    cadence: "no card required",
    summary:
      "Enough to see your own room reimagined and decide whether the concept is worth building.",
    features: [
      "5 spatial render credits",
      "One room project",
      "All eight signature aesthetics",
      "Save and compare concepts",
    ],
    cta: "Start Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Kanso Pro",
    price: "Rs 2,400",
    cadence: "per month",
    summary:
      "For a live renovation, where you need options, specifications, and a specialist ready to quote.",
    features: [
      "Unlimited spatial renders",
      "Unlimited room projects",
      "Full material specification sheets",
      "Price-locked scope documents",
      "Priority verified artisan matching",
      "Downloadable concept boards",
    ],
    cta: "Go Pro",
    href: "/signup",
    featured: true,
  },
  {
    name: "Studio",
    price: "Talk to us",
    cadence: "for teams and trades",
    summary:
      "For design studios and contractors running multiple client projects through Kanso at once.",
    features: [
      "Everything in Kanso Pro",
      "Multi-client project workspace",
      "Team seats and shared briefs",
      "Lead routing to your studio",
      "Dedicated onboarding",
    ],
    cta: "Contact Sales",
    href: "/project/new/room-type",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="w-full flex-1">
        <section className="w-full bg-[#f4f0ea] py-20 sm:py-28">
          <div className="mx-auto w-full max-w-2xl px-6 text-center sm:px-8">
            <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
              Pricing
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-[#1b1c19] sm:text-5xl">
              Start free. Pay when it becomes real.
            </h1>
            <p className="mx-auto mt-6 w-full max-w-[36rem] font-body text-base leading-relaxed text-[#1b1c19]/70 sm:text-lg">
              Every account begins with free render credits, because you should see your
              own room resolved before deciding this is worth paying for.
            </p>
          </div>
        </section>

        <section className="w-full py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`flex w-full flex-col rounded-2xl border p-8 ${
                    tier.featured
                      ? "border-[#1b1c19] bg-[#1b1c19] text-[#fbf9f4]"
                      : "border-[#c4c7c7] bg-[#f4f0ea] text-[#1b1c19]"
                  }`}
                >
                  {tier.featured && (
                    <span className="mb-5 inline-block w-fit rounded-2xl border border-[#fbf9f4]/30 px-3 py-1 font-body text-[10px] tracking-[0.16em] uppercase">
                      Most Chosen
                    </span>
                  )}

                  <h2 className="font-body text-lg font-semibold">{tier.name}</h2>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-4xl">{tier.price}</span>
                    <span
                      className={`font-body text-sm ${
                        tier.featured ? "text-[#fbf9f4]/55" : "text-[#1b1c19]/55"
                      }`}
                    >
                      {tier.cadence}
                    </span>
                  </div>

                  <p
                    className={`mt-5 w-full font-body text-sm leading-relaxed ${
                      tier.featured ? "text-[#fbf9f4]/70" : "text-[#1b1c19]/65"
                    }`}
                  >
                    {tier.summary}
                  </p>

                  <ul className="mt-8 flex flex-1 flex-col gap-3.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            tier.featured ? "text-[#fbf9f4]" : "text-[#1b1c19]"
                          }`}
                        />
                        <span
                          className={`w-full font-body text-sm leading-relaxed ${
                            tier.featured ? "text-[#fbf9f4]/85" : "text-[#1b1c19]/75"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={`group mt-9 inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 font-body text-sm font-medium transition-colors duration-300 ${
                      tier.featured
                        ? "bg-[#fbf9f4] text-[#1b1c19] hover:bg-white"
                        : "bg-[#1b1c19] text-white hover:bg-black"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-14 w-full max-w-2xl text-center font-body text-sm leading-relaxed text-[#1b1c19]/50">
              Prices shown are indicative for the pilot. Renders are visual concepts, not
              construction drawings, and material costs are estimates against local
              supplier stock at the time of generation.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
