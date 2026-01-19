'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from '@/contexts/LanguageContext';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useTranslations('auth');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const verifyEmail = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(result.error || t('verificationFailed'));
        return;
      }

      setStatus('success');
      setMessage(result.message);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login?verified=true');
      }, 3000);
    } catch {
      setStatus('error');
      setMessage(t('verificationError'));
    }
  }, [token, router, t]);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token, verifyEmail]);

  // Handle no token case
  if (!token) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {t('verificationFailed')}
        </h2>
        <p className="text-white/60 mb-6 text-center">
          {t('noToken')}
        </p>
        <div className="space-y-3">
          <Link
            href="/auth/register"
            className="block w-full py-3 px-4 bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-semibold rounded-lg transition-colors text-center"
          >
            {t('registerAgain')}
          </Link>
          <Link
            href="/auth/login"
            className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/10 text-center"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      {status === 'loading' && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            {t('verifyingEmail')}
          </h2>
          <p className="text-white/60 text-center">
            {t('pleaseWait')}
          </p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            {t('emailVerified')}
          </h2>
          <p className="text-white/60 mb-6 text-center">
            {message}
          </p>
          <p className="text-white/40 text-sm text-center">
            {t('redirectingToLogin')}
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            {t('verificationFailed')}
          </h2>
          <p className="text-white/60 mb-6 text-center">
            {message}
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/register"
              className="block w-full py-3 px-4 bg-[#FF6B35] hover:bg-[#E05A2B] text-white font-semibold rounded-lg transition-colors text-center"
            >
              {t('registerAgain')}
            </Link>
            <Link
              href="/auth/login"
              className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/10 text-center"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <div className="w-16 h-16 mx-auto mb-6 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
      <div className="h-8 bg-white/5 rounded w-3/4 mx-auto mb-4" />
      <div className="h-4 bg-white/5 rounded w-1/2 mx-auto" />
    </div>
  );
}

export default function VerifyPage() {
  const t = useTranslations('auth');

  return (
    <main className="min-h-screen bg-[#070612] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white font-serif">GOODMAN GLS</h1>
            <p className="text-[#FF6B35] font-semibold mt-1">{t('partnerPortal')}</p>
          </Link>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <VerifyContent />
        </Suspense>

        {/* Back to Home */}
        <div className="mt-6">
          <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
            ← {t('backToHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}
