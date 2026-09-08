"use client";

import React from "react";
import { Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I had put off the living room for two years because I could not picture it. Four photos later I was looking at my own room, resolved.",
    name: "Ayesha Raza",
    role: "Homeowner, Lahore",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "The material list is what sold me. I walked into the shop knowing the finish, the quantity, and the price before I spoke to anyone.",
    name: "Daniyal Khan",
    role: "Homeowner, Karachi",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "Briefs used to arrive as a screenshot and a paragraph. Now I get the render, the specs and the budget together. I quote in a fraction of the time.",
    name: "Imran Sethi",
    role: "Master Joiner, 18 years",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "Zero change orders on the last three Kanso projects. The scope was agreed before I picked up a tool, so there was nothing to argue about.",
    name: "Faisal Mahmood",
    role: "Electrical Contractor",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "My husband and I stopped disagreeing about the palette the moment we could both see it on our own walls.",
    name: "Sana Iqbal",
    role: "Homeowner, Islamabad",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "As a painter I am usually last to know. Getting the surface prep and finish schedule up front changed how I plan a week.",
    name: "Yousuf Ali",
    role: "Finishing Specialist",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="mx-3 flex w-[min(85vw,340px)] shrink-0 flex-col justify-between rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] p-6 transition-all duration-500 hover:border-[#1b1c19] hover:shadow-lg sm:w-[400px]">
      <Quote className="mb-4 h-5 w-5 shrink-0 text-[#1b1c19]/30" />
      <blockquote className="w-full font-body text-sm leading-relaxed text-[#1b1c19]/80">
        {item.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-[#c4c7c7] pt-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.avatar}
          alt=""
          loading="lazy"
          className="h-10 w-10 shrink-0 rounded-full border border-[#c4c7c7] object-cover"
        />
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-body text-sm font-semibold text-[#1b1c19]">
            {item.name}
          </span>
          <span className="truncate font-body text-xs text-[#1b1c19]/55">
            {item.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialMarquee() {
  return (
    <div className="w-full overflow-hidden py-2">
      <div className="flex w-max animate-marquee-slow">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {TESTIMONIALS.map((item) => (
              <TestimonialCard key={`${copy}-${item.name}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
