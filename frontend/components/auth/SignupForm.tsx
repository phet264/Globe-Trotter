'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    try {
      await signup(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create account');
      }
    }
  };

  return (
    <div className="w-full flex flex-col justify-center h-full max-h-full py-1">
      <div className="space-y-1 mb-3 xl:mb-5 text-center sm:text-left shrink-0">
        <h1 className="text-3xl lg:text-4xl 2xl:text-5xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">
          Design your<br />perfect trip
        </h1>
      </div>

      {error && (
        <div className="mb-3 xl:mb-4 p-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] xl:text-xs text-center shrink-0">
          {error}
        </div>
      )}

      {/* Social Logins - Pill Group */}
      <div className="flex justify-center sm:justify-start mb-3 xl:mb-5 shrink-0">
        <div className="inline-flex items-center bg-slate-50 rounded-full p-1 border border-slate-100 scale-90 xl:scale-100 origin-left">
          <button type="button" className="w-10 h-8 xl:w-12 xl:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><circle cx="12" cy="12" r="10" className="hidden"/><path d="M10 2c1 .5 2 2 2 5h-5c0-3 1.4-5 3-5Z"/></svg>
          </button>
          <button type="button" className="w-10 h-8 xl:w-12 xl:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
          </button>
          <button type="button" className="w-10 h-8 xl:w-12 xl:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 xl:gap-4 mb-3 xl:mb-5 shrink-0">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[10px] xl:text-xs text-slate-400 font-medium">or</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 xl:space-y-3 shrink-0">
        <div className="space-y-1">
          <Input 
            id="name" 
            placeholder="Full name" 
            className="h-9 xl:h-11 px-4 xl:px-5 text-sm xl:text-base rounded-2xl bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:bg-white transition-colors"
            {...register('name')} 
            aria-invalid={!!errors.name} 
          />
          {errors.name && <p className="text-[10px] xl:text-xs text-destructive px-2 leading-none mt-0.5">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Input 
            id="email" 
            type="email" 
            placeholder="Email" 
            className="h-9 xl:h-11 px-4 xl:px-5 text-sm xl:text-base rounded-2xl bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:bg-white transition-colors"
            {...register('email')} 
            aria-invalid={!!errors.email} 
          />
          {errors.email && <p className="text-[10px] xl:text-xs text-destructive px-2 leading-none mt-0.5">{errors.email.message}</p>}
        </div>

        <div className="space-y-1 relative">
          <Input 
            id="password" 
            type="password" 
            placeholder="Password"
            className="h-9 xl:h-11 px-4 xl:px-5 text-sm xl:text-base rounded-2xl bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:bg-white transition-colors pr-10 xl:pr-12"
            {...register('password')} 
            aria-invalid={!!errors.password} 
          />
          <div className="absolute right-3 xl:right-4 top-2 xl:top-2.5 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors scale-90 xl:scale-100">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          {errors.password && <p className="text-[10px] xl:text-xs text-destructive px-2 leading-none mt-0.5">{errors.password.message}</p>}
        </div>

        <div className="space-y-1 relative">
          <Input 
            id="confirmPassword" 
            type="password" 
            placeholder="Confirm Password"
            className="h-9 xl:h-11 px-4 xl:px-5 text-sm xl:text-base rounded-2xl bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:bg-white transition-colors"
            {...register('confirmPassword')} 
            aria-invalid={!!errors.confirmPassword} 
          />
          {errors.confirmPassword && <p className="text-[10px] xl:text-xs text-destructive px-2 leading-none mt-0.5">{errors.confirmPassword.message}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full rounded-2xl h-10 xl:h-11 mt-3 xl:mt-4 bg-[#3B6654] hover:bg-[#2D4F41] text-white font-medium text-sm xl:text-base transition-colors" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Starting...' : 'Start'}
        </Button>
      </form>

      <div className="text-center sm:text-left text-xs xl:text-sm text-slate-500 mt-4 xl:mt-6 shrink-0">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-slate-900 font-bold hover:underline underline-offset-4">
          Log in
        </Link>
      </div>
    </div>
  );
}
