import { Suspense } from "react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back."
      description="Sign in to continue designing your space."
      imageUrl="/assets/images/auth/login-bg.jpg"
      imageAlt="A warm minimal living room with layered neutral textures"
      quote="Transforming imagination into scope-locked reality."
    >
      {/* LoginForm reads the `next` query parameter, so it must sit behind a
          Suspense boundary or prerendering this page fails at build time. */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
