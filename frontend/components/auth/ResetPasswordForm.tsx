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
import { useSearchParams } from 'next/navigation';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus('idle');
    try {
      await authApi.resetPassword({ token, password: data.password });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (!token) {
    return (
      <div className="space-y-6 w-full max-w-sm text-center">
        <h1 className="text-3xl font-display font-bold">Invalid Link</h1>
        <p className="text-muted-foreground">
          This password reset link is invalid or has expired.
        </p>
        <Link href="/auth/forgot-password" className="block mt-8">
          <Button variant="outline" className="w-full rounded-full h-11">
            Request new link
          </Button>
        </Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-6 w-full max-w-sm text-center">
        <h1 className="text-3xl font-display font-bold">Password Reset!</h1>
        <p className="text-muted-foreground">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <Link href="/auth/login" className="block mt-8">
          <Button className="w-full rounded-full h-11">
            Go to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-display font-bold">Create new password</h1>
        <p className="text-muted-foreground">Enter your new secure password</p>
      </div>

      {status === 'error' && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
          The password reset failed. The link may have expired.
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" {...register('password')} aria-invalid={!!errors.password} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} aria-invalid={!!errors.confirmPassword} />
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full rounded-full h-11" disabled={isSubmitting}>
        {isSubmitting ? 'Resetting...' : 'Reset password'}
      </Button>
    </form>
  );
}
