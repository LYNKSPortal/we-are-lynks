'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0f17] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image
            src="/logo-light-version.png"
            alt="LYNKS Logo"
            width={200}
            height={67}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-gray-400">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          {submitted ? (
            <div className="text-center">
              <p className="text-gray-300">
                If an account with that email exists, a password reset link has been sent.
                Please check your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#dbf72c] transition-colors disabled:opacity-50"
                  placeholder="Enter your admin email"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#dbf72c] text-[#0c0f17] px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#dbf72c]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/admin/login" className="text-sm text-gray-400 hover:text-[#dbf72c] transition-colors">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
