'use client';

import { Suspense, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useTranslations } from '@/contexts/LanguageContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/portal';
  const t = useTranslations('auth');
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(data.email, data.password);

      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Success message from registration */}
      {searchParams.get('registered') && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
          {t('registrationSuccess')}
        </div>
      )}

      {/* Verified message */}
      {searchParams.get('verified') && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
          {t('verificationSuccess')}
        </div>
      )}

      {/* Password reset message */}
      {searchParams.get('reset') && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
          {t('passwordResetSuccess')}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            {t('email')}
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#FF6B35] transition-colors"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            {t('password')}
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-white/60">
            <input type="checkbox" className="mr-2 rounded border-white/20" />
            {t('rememberMe')}
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-[#FF6B35] hover:underline"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('loggingIn') : t('login')}
        </button>
      </form>

      <div className="mt-6 text-center text-white/60 text-sm">
        {t('noAccount')}{' '}
        <Link href="/auth/register" className="text-[#FF6B35] hover:underline font-semibold">
          {t('registerNow')}
        </Link>
      </div>
    </>
  );
}

function LoginFormFallback() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-12 bg-white/5 rounded-lg" />
      <div className="h-12 bg-white/5 rounded-lg" />
      <div className="h-12 bg-[#FF6B35]/50 rounded-lg" />
    </div>
  );
}

export default function LoginPage() {
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

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {t('loginTitle')}
          </h2>

          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>

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
