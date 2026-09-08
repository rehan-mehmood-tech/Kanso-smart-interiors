import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create an Account"
      description="Begin your journey to a more intentional space."
      imageUrl="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=2400&q=90"
      imageAlt="A calm living room with rattan pendants and soft sage walls"
      quote="Four walls in. A room you can actually build out."
    >
      <SignUpForm />
    </AuthLayout>
  );
}
