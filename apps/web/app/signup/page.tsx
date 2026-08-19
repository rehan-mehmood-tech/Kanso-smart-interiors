import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <AuthLayout 
      title="Create an Account"
      description="Begin your journey to a more intentional space."
      imageUrl="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
