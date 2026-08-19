"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthFooter } from './AuthFooter';
import Link from 'next/link';

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('homeowner');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Stubbed redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Full Name Field */}
        <div className="relative">
          <label htmlFor="fullName" className="sr-only">Full Name</label>
          <input 
            id="fullName" 
            name="fullName" 
            type="text" 
            autoComplete="name" 
            required 
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-on-surface focus:ring-0 px-0 py-2 font-body-lg text-body-lg text-primary placeholder:text-secondary-fixed-dim transition-colors duration-300" 
          />
        </div>

        {/* Email Field */}
        <div className="relative">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            autoComplete="email" 
            required 
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-on-surface focus:ring-0 px-0 py-2 font-body-lg text-body-lg text-primary placeholder:text-secondary-fixed-dim transition-colors duration-300" 
          />
        </div>
        
        {/* Password Field */}
        <div className="relative">
          <label htmlFor="password" className="sr-only">Password</label>
          <input 
            id="password" 
            name="password" 
            type={showPassword ? "text" : "password"} 
            autoComplete="new-password" 
            required 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-on-surface focus:ring-0 px-0 py-2 font-body-lg text-body-lg text-primary placeholder:text-secondary-fixed-dim transition-colors duration-300 pr-10" 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {password.length > 0 && password.length < 8 && (
          <p className="font-label-sm text-xs text-error mt-1">Must be at least 8 characters.</p>
        )}
      </div>
      
      {/* Role / Intent Indicator */}
      <div className="pt-2">
        <label htmlFor="role" className="sr-only">I am a...</label>
        <select 
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-on-surface focus:ring-0 px-0 py-2 font-body-md text-body-md text-primary transition-colors duration-300 cursor-pointer"
        >
          <option value="homeowner">Homeowner looking to design</option>
          <option value="professional">Professional / Business</option>
        </select>
      </div>

      <div className="pt-2">
        <p className="font-label-sm text-xs text-secondary-fixed-dim normal-case tracking-normal">
          By signing up, you agree to our <Link href="/terms" className="text-primary hover:underline underline-offset-4">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline underline-offset-4">Privacy Policy</Link>.
        </p>
      </div>
      
      {/* Actions */}
      <div className="pt-4 space-y-4">
        <button 
          type="submit" 
          disabled={password.length > 0 && password.length < 8}
          className="w-full bg-primary text-on-primary font-body-md text-body-md py-4 rounded-[8px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
        >
          Create Account
          <ArrowRight className="w-5 h-5" />
        </button>
        
        {/* Social login divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-secondary font-label-sm text-xs uppercase tracking-wider">Or sign up with</span>
          </div>
        </div>
        
        {/* Social button */}
        <button 
          type="button"
          className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-outline-variant rounded-[8px] shadow-sm font-label-sm text-label-sm text-on-surface bg-transparent hover:bg-surface-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        
        <AuthFooter mode="signup" />
      </div>
    </form>
  );
}
