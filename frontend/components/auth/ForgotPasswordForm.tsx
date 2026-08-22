'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus('idle');
    try {
      await authApi.forgotPassword(data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="space-y-6 w-full max-w-sm text-center">
        <h1 className="text-3xl font-display font-bold">Check your email</h1>
        <p className="text-muted-foreground">
          If an account exists with that email, we have sent password reset instructions.
        </p>
        <Link href="/auth/login" className="block mt-8">
          <Button variant="outline" className="w-full rounded-full h-11">
            Return to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-display font-bold">Reset password</h1>
        <p className="text-muted-foreground">Enter your email and we&apos;ll send you a recovery link</p>
      </div>

      {status === 'error' && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
          An error occurred. Please try again later.
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full rounded-full h-11" disabled={isSubmitting}>
        {isSubmitting ? 'Sending instructions...' : 'Send reset instructions'}
      </Button>

      <div className="text-center text-sm mt-6">
        <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
          Back to login
        </Link>
      </div>
    </form>
  );
}
