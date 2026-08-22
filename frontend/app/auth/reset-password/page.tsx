import React, { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-11 w-11 rounded-full border-4 border-primary border-r-transparent animate-spin" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
