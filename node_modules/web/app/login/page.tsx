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
      <LoginForm />
    </AuthLayout>
  );
}
