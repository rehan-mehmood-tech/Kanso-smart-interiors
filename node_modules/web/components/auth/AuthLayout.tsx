import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  quote?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  imageUrl = "/assets/images/auth/login-bg.jpg",
  imageAlt = "A warm, minimal living room in a considered material palette",
  quote = "Transforming imagination into scope-locked reality.",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fbf9f4] text-[#1b1c19]">
      {/* Branded top bar — the shared SiteHeader, spanning the full split-screen width */}
      <SiteHeader position="fixed">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-2xl border border-[#c4c7c7] px-4 py-2 font-body text-sm font-medium whitespace-nowrap text-[#1b1c19] transition-colors hover:bg-[#fbf9f4]"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to Home
        </Link>
      </SiteHeader>

      <main className="grid min-h-screen grid-cols-1 pt-16 lg:grid-cols-2">
        {/* Left: imagery canvas */}
        <section className="relative block aspect-[4/3] w-full max-w-full overflow-hidden bg-[#f4f0ea] sm:aspect-[16/9] lg:aspect-auto lg:h-auto">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            quality={95}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="relative h-full w-full object-cover object-center"
          />
          {/* Ambient overlay keeps the quote readable over any image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c19]/60 via-transparent to-black/30" />

          <figure className="absolute right-6 bottom-6 left-6 z-10 sm:right-8 sm:bottom-8 sm:left-8 lg:right-12 lg:bottom-12 lg:left-12">
            <blockquote className="w-full max-w-[26rem] font-serif text-lg leading-snug text-white drop-shadow-md sm:text-xl lg:text-2xl">
              {quote}
            </blockquote>
          </figure>
        </section>

        {/* Right: authentication form */}
        <section className="flex w-full max-w-full items-center justify-center bg-[#fbf9f4] px-6 py-12 sm:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-[28rem]">
            <div className="text-left">
              <h1 className="font-serif text-3xl leading-tight text-[#1b1c19] lg:text-4xl">
                {title}
              </h1>
              <p className="mt-3 w-full font-body text-base leading-relaxed text-[#1b1c19]/65">
                {description}
              </p>
            </div>

            <div className="mt-10">{children}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
