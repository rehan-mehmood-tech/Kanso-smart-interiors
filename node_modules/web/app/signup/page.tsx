import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create an Account"
      description="Begin your journey to a more intentional space."
      imageUrl="/assets/images/auth/signup-bg.jpg"
      imageAlt="A calm living room with rattan pendants and soft sage walls"
      quote="Four walls in. A room you can actually build out."
    >
      <SignUpForm />
    </AuthLayout>
  );
}
