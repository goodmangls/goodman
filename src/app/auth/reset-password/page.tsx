'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from '@/contexts/LanguageContext';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useTranslations('auth');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError(t('invalidResetToken'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to reset password. Please try again.');
        return;
      }

      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login?reset=true');
      }, 3000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If no token, show error
  if (!token) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {t('invalidResetToken')}
        </h2>
        <p className="text-white/60 mb-6 text-center">
          The password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link
          href="/auth/forgot-password"
          className="block w-full py-3 px-4 bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-semibold rounded-lg transition-colors text-center"
        >
          {t('sendResetLink')}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      {isSuccess ? (
        <>
          <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            {t('passwordResetSuccess')}
          </h2>
          <p className="text-white/40 text-sm text-center">
            {t('redirectingToLogin')}
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            {t('resetPassword')}
          </h2>
          <p className="text-white/50 text-center mb-8">
            Enter your new password below
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                {t('newPassword')}
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#FF6B35] transition-colors"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                {t('confirmNewPassword')}
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#FF6B35] transition-colors"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('resettingPassword') : t('resetPassword')}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <div className="space-y-5 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-white/5 rounded w-1/2 mx-auto" />
        <div className="h-12 bg-white/5 rounded-lg" />
        <div className="h-12 bg-white/5 rounded-lg" />
        <div className="h-12 bg-[#FF6B35]/50 rounded-lg" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations('auth');

  return (
    <main className="min-h-screen bg-[#070612] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white font-serif">GOODMAN GLS</h1>
            <p className="text-[#FF6B35] font-semibold mt-1">{t('partnerPortal')}</p>
          </Link>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <ResetPasswordForm />
        </Suspense>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
            ← {t('backToHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}
