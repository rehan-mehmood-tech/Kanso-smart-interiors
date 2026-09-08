import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back."
      description="Sign in to continue designing your space."
      imageUrl="https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=2400&q=90"
      imageAlt="A warm minimal living room with layered neutral textures"
      quote="Transforming imagination into scope-locked reality."
    >
      <LoginForm />
    </AuthLayout>
  );
}
