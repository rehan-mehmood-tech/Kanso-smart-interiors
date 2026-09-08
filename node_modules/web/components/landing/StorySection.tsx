"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CircleHelp,
  Ruler,
  ReceiptText,
  ScanLine,
  Layers,
  BadgeCheck,
  Hammer,
  MessagesSquare,
  ClipboardList,
} from "lucide-react";
import { MagicText } from "@/components/ui/magic-text";

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

type Chapter = {
  number: string;
  kicker: string;
  title: string;
  lede: string;
  body: string[];
  pull: string;
  image: string;
  imageAlt: string;
  cards: { icon: React.ElementType; title: string; copy: string }[];
  flip?: boolean;
  tone: "light" | "surface";
};

const CHAPTERS: Chapter[] = [
  {
    number: "Chapter One",
    kicker: "The Homeowner Dilemma",
    title: "Buying a room you have never actually seen",
    lede: "Almost every renovation begins the same way — with a decision made blind.",
    body: [
      "You stand in a showroom holding a fabric swatch against fluorescent light, trying to imagine it in a room three kilometres away with north-facing windows. You measure a wall twice, then buy a sofa that arrives forty centimetres too long for it. The mood board on your phone looked effortless; the room it produced does not.",
      "Then the estimate moves. A contractor quotes a figure in week one, discovers something behind the plaster in week three, and the number changes. Not out of dishonesty, but out of the simple fact that nobody agreed, in writing and in pictures, on what the finished room was supposed to be. Deliveries slip. A joiner waits on a decision you did not know you were meant to make. Six weeks stretches into five months.",
      "The failure is not taste. It is that imagination has no shared, spatially accurate reference, so every party is quietly building a slightly different room in their head.",
    ],
    pull: "You are not buying furniture. You are buying a guess, and paying full price for it.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "An unfinished room mid-renovation with materials still undecided",
    cards: [
      {
        icon: CircleHelp,
        title: "Visualisation guesswork",
        copy: "Swatches and mood boards never survive contact with your actual light and proportions.",
      },
      {
        icon: Ruler,
        title: "Spatial mismatch",
        copy: "Pieces get chosen against a measurement, not against the wall they must live on.",
      },
      {
        icon: ReceiptText,
        title: "Scope creep",
        copy: "Undocumented assumptions surface as change orders once the work has already begun.",
      },
    ],
    tone: "light",
  },
  {
    number: "Chapter Two",
    kicker: "The Kanso Breakthrough",
    title: "Turning a feeling into a specification",
    lede: "Kanso sits exactly where imagination has always handed off badly to execution.",
    body: [
      "It starts with four photographs, one per wall. That is deliberate. Four walls give the spatial engine the geometry of the room: where the light falls, where the door swings, how deep the alcove actually is. What comes back is not a stock interior borrowed from a catalogue. It is your room, with your window, rendered in the aesthetic you chose.",
      "Underneath each render sits the part that changes outcomes: a material specification. Every surface, finish, and fixture is named and costed against locally sourceable stock. The picture and the bill of materials describe the same room, so the thing you fell in love with is the thing that can actually be built.",
      "That specification is then locked. Price and scope are agreed before a single tool is lifted, and both sides, you and the specialist, work from one document instead of two impressions.",
    ],
    pull: "A render you cannot cost is a wish. A render with a locked spec is a plan.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "A resolved, warmly lit living room in a considered material palette",
    cards: [
      {
        icon: ScanLine,
        title: "Four-wall spatial renders",
        copy: "Your geometry and light preserved, so the concept still reads as your room.",
      },
      {
        icon: Layers,
        title: "Material specifications",
        copy: "Every finish named, sourced, and costed against real local availability.",
      },
      {
        icon: BadgeCheck,
        title: "Price-locked transparency",
        copy: "Scope agreed up front, so the final invoice matches the opening number.",
      },
    ],
    flip: true,
    tone: "surface",
  },
  {
    number: "Chapter Three",
    kicker: "The Artisan & Specialist Crisis",
    title: "The best trades lose work for reasons that have nothing to do with craft",
    lede: "Ask any carpenter why a job went wrong and it is rarely about the joinery.",
    body: [
      "A skilled joiner can cut a flawless housing joint and still lose a client, because the brief arrived as a screenshot and a sentence, was interpreted reasonably, and turned out to mean something else entirely. The rework is not billable. The reputational cost is worse. Electricians quote against a layout that changes after first fix. Painters arrive to surfaces nobody told them were unprepared.",
      "So the trade defends itself the only way it can, by padding estimates against ambiguity. The homeowner reads that padding as a high price, and the most careful specialists price themselves out of exactly the work they are best at.",
      "Kanso hands the specialist something the industry rarely provides: a scope-locked brief. The approved render, the material list, the wall-by-wall captures, and the agreed budget arrive together, pre-vetted, before the first site visit. Less time quoting into fog. Less rework. Estimates that reflect craft rather than risk.",
    ],
    pull: "Give a good tradesperson an unambiguous brief and the argument disappears.",
    image:
      "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "A carpenter cutting timber to a specified length in the workshop",
    cards: [
      {
        icon: MessagesSquare,
        title: "Miscommunication ends",
        copy: "One approved visual reference replaces a thread of conflicting screenshots.",
      },
      {
        icon: ClipboardList,
        title: "Scope-locked briefs",
        copy: "Renders, materials, captures, and budget arrive as a single vetted package.",
      },
      {
        icon: Hammer,
        title: "Quote on craft, not risk",
        copy: "No defensive padding against ambiguity that was never the trade's fault.",
      },
    ],
    tone: "light",
  },
];

function ChapterBlock({ chapter }: { chapter: Chapter }) {
  return (
    <article
      className={`w-full py-20 sm:py-28 ${
        chapter.tone === "surface" ? "bg-[#f4f0ea]" : "bg-[#fbf9f4]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <motion.header
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
            {chapter.number} — {chapter.kicker}
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-[1.15] text-[#1b1c19] sm:text-4xl lg:text-[2.75rem]">
            {chapter.title}
          </h2>
          <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-[#1b1c19]/70">
            {chapter.lede}
          </p>
        </motion.header>

        <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`lg:col-span-7 ${chapter.flip ? "lg:order-2" : ""}`}
          >
            <div className="max-w-2xl space-y-6">
              {chapter.body.map((para, i) => (
                <MagicText
                  key={i}
                  text={para}
                  className="w-full text-[#1b1c19]"
                />
              ))}

              <blockquote className="mt-10 w-full max-w-2xl border-l-2 border-[#1b1c19] py-2 pl-6">
                <p className="font-serif text-xl leading-snug text-[#1b1c19] sm:text-2xl">
                  {chapter.pull}
                </p>
              </blockquote>
            </div>
          </motion.div>

          <motion.figure
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`lg:col-span-5 ${chapter.flip ? "lg:order-1" : ""}`}
          >
            <div className="aspect-4/5 w-full overflow-hidden rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={chapter.image}
                alt={chapter.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 w-full font-body text-xs leading-relaxed text-[#1b1c19]/50">
              {chapter.imageAlt}
            </figcaption>
          </motion.figure>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {chapter.cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`w-full cursor-default rounded-2xl border border-[#c4c7c7] p-6 transition-colors duration-300 hover:border-[#1b1c19] hover:shadow-lg ${
                  chapter.tone === "surface" ? "bg-[#fbf9f4]" : "bg-[#f4f0ea]"
                }`}
              >
                <Icon className="mb-5 h-6 w-6 shrink-0 text-[#1b1c19]" />
                <h3 className="font-body text-base font-semibold text-[#1b1c19]">
                  {card.title}
                </h3>
                <p className="mt-2 w-full font-body text-sm leading-relaxed text-[#1b1c19]/65">
                  {card.copy}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export function StorySection() {
  return (
    <section id="impact" className="w-full scroll-mt-16">
      {CHAPTERS.map((chapter) => (
        <ChapterBlock key={chapter.number} chapter={chapter} />
      ))}
    </section>
  );
}
