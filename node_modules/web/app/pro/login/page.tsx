import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { VendorLoginForm } from "@/components/pro/auth/VendorLoginForm";

export const metadata: Metadata = {
  title: "Partner Sign In — Kanso Smart Interiors",
  description:
    "Sign in to the Kanso partner portal to manage leads, inventory and your crew.",
};

export default function VendorLoginPage() {
  return (
    <AuthLayout
      title="Partner sign in."
      description="Manage your leads, your catalogue and your crew in one workspace."
      imageUrl="/assets/images/styles/industrial.jpg"
      imageAlt="A workshop interior with exposed structure and raw materials"
      quote="The best trades lose work for reasons that have nothing to do with craft."
    >
      {/* useSearchParams needs a Suspense boundary during prerender. */}
      <Suspense fallback={null}>
        <VendorLoginForm />
      </Suspense>
    </AuthLayout>
  );
}
