import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Hammer,
  Store,
  ClipboardList,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Partner with Kanso — Grow Your Interior Business",
  description:
    "Receive scope-locked, pre-qualified interior leads with the render, the material schedule and the client's budget already agreed.",
};

const TIERS = [
  {
    name: "Solo Tradesman",
    forWho: "Carpenters, plumbers, electricians, painters",
    price: "Rs 1,200",
    cadence: "per month",
    icon: Hammer,
    summary:
      "One seat, one trade, and a lead feed filtered to the areas you actually travel to.",
    features: [
      "Single user seat",
      "Local lead feed, filtered by service area",
      "Full customer contact details on every lead",
      "Four-wall captures and the approved render",
      "Material schedule for the work you are quoting",
      "Lead status tracking through to completion",
    ],
    featured: false,
  },
  {
    name: "Shop + Crew",
    forWho: "Furniture stores, joineries, fit-out contractors",
    price: "Rs 4,800",
    cadence: "per month",
    icon: Store,
    summary:
      "Everything in Solo, plus the catalogue that puts your own stock inside the concepts customers approve.",
    features: [
      "Everything in Solo Tradesman",
      "Up to 8 staff seats with owner controls",
      "Full product inventory management",
      "Priority AI mapping — your stock is specified in generated concepts",
      "Catalogue performance reporting",
      "Priority placement in the matching queue",
    ],
    featured: true,
  },
];

const VALUE_PROPS = [
  {
    icon: ClipboardList,
    title: "Briefs arrive complete",
    body: "Renders, wall-by-wall captures, material schedules and the client's agreed budget land as one package before the first site visit.",
  },
  {
    icon: Ruler,
    title: "Quote on craft, not risk",
    body: "The ambiguity you used to pad your estimates against has already been designed out, so you price the work rather than the uncertainty.",
  },
  {
    icon: ShieldCheck,
    title: "Scope-locked from the start",
    body: "The customer has already approved a costed concept. Change orders stop being an argument you have to win.",
  },
];

export default function PartnersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f4]">
      <Navbar />

      <main className="w-full flex-1">
        {/* Hero */}
        <section className="w-full bg-[#f4f0ea] py-20 sm:py-28">
          <div className="mx-auto w-full max-w-3xl px-6 text-center sm:px-8">
            <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
              For Trades and Retailers
            </span>
            <h1 className="mt-5 font-serif text-3xl leading-tight text-balance text-[#1b1c19] sm:text-4xl md:text-5xl">
              Partner with Kanso — grow your interior business
            </h1>
            <p className="mx-auto mt-6 max-w-[42rem] font-body text-base leading-relaxed text-[#1b1c19]/65 sm:text-lg">
              Every Kanso lead arrives with an approved render, a costed material
              schedule and a client who already knows what the work will cost.
              You quote on craft instead of guesswork.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/partners/register"
                className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-7 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-colors duration-300 hover:bg-black sm:w-auto"
              >
                Register Your Business
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pro/login"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-[#c4c7c7] px-7 py-3 font-body text-sm font-medium text-[#1b1c19] transition-colors duration-300 hover:border-[#1b1c19] hover:bg-[#fbf9f4] sm:w-auto"
              >
                Partner Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* What a partner actually receives */}
        <section className="w-full py-20 sm:py-24">
          <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
              {VALUE_PROPS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex flex-col gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-[#1b1c19]" />
                  <h2 className="font-serif text-lg leading-snug text-[#1b1c19]">
                    {title}
                  </h2>
                  <p className="font-body text-sm leading-relaxed text-[#1b1c19]/65">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tier comparison */}
        <section className="w-full border-t border-[#c4c7c7] bg-[#f4f0ea] py-20 sm:py-28">
          <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
            <div className="mx-auto mb-14 w-full max-w-2xl text-center">
              <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
                Partner Plans
              </span>
              <h2 className="mt-5 font-serif text-2xl leading-tight text-[#1b1c19] sm:text-3xl md:text-4xl">
                Two ways to work with us
              </h2>
              <p className="mx-auto mt-5 max-w-[36rem] font-body text-sm leading-relaxed text-[#1b1c19]/65 sm:text-base">
                Both tiers include full contact details on every lead assigned to
                you. Leads are only released to partners on an active plan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {TIERS.map((tier) => {
                const Icon = tier.icon;
                return (
                  <article
                    key={tier.name}
                    className={`flex w-full flex-col rounded-2xl p-8 transition-colors duration-500 sm:p-10 ${
                      tier.featured
                        ? "bg-[#1b1c19] text-[#fbf9f4]"
                        : "border border-[#c4c7c7] bg-[#fbf9f4] text-[#1b1c19]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          tier.featured ? "text-[#fbf9f4]" : "text-[#1b1c19]"
                        }`}
                      />
                      <h3 className="font-serif text-xl leading-tight">{tier.name}</h3>
                    </div>

                    <p
                      className={`mt-2 font-body text-xs tracking-[0.12em] uppercase ${
                        tier.featured ? "text-[#fbf9f4]/55" : "text-[#1b1c19]/45"
                      }`}
                    >
                      {tier.forWho}
                    </p>

                    <div className="mt-7 flex items-baseline gap-2">
                      <span className="font-serif text-3xl leading-none tabular-nums sm:text-4xl">
                        {tier.price}
                      </span>
                      <span
                        className={`font-body text-sm ${
                          tier.featured ? "text-[#fbf9f4]/55" : "text-[#1b1c19]/50"
                        }`}
                      >
                        {tier.cadence}
                      </span>
                    </div>

                    <p
                      className={`mt-5 font-body text-sm leading-relaxed ${
                        tier.featured ? "text-[#fbf9f4]/70" : "text-[#1b1c19]/65"
                      }`}
                    >
                      {tier.summary}
                    </p>

                    <ul className="mt-8 flex flex-1 flex-col gap-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-3">
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              tier.featured ? "text-[#fbf9f4]/70" : "text-[#1b1c19]/55"
                            }`}
                          />
                          <span
                            className={`font-body text-sm leading-relaxed ${
                              tier.featured ? "text-[#fbf9f4]/85" : "text-[#1b1c19]/75"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/partners/register?tier=${
                        tier.name === "Solo Tradesman" ? "solo_tradesman" : "shop_crew"
                      }`}
                      className={`group mt-10 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 font-body text-sm font-medium transition-colors duration-300 ${
                        tier.featured
                          ? "bg-[#fbf9f4] text-[#1b1c19] hover:bg-white"
                          : "bg-[#1b1c19] text-[#fbf9f4] hover:bg-black"
                      }`}
                    >
                      Choose {tier.name}
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </article>
                );
              })}
            </div>

            <p className="mx-auto mt-10 max-w-[38rem] text-center font-body text-sm leading-relaxed text-[#1b1c19]/50">
              Already registered?{" "}
              <Link
                href="/pro/login"
                className="font-medium text-[#1b1c19] underline-offset-4 transition-colors hover:underline"
              >
                Sign in to the partner portal
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
