"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useResetPassword } from "@/actions/auth/useResetPassword";
import "@/utils/styles/index.css";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const { mutateAsync: mutateResetPassword, isPending: isResetPasswordPending } = useResetPassword();

  useEffect(() => {
    if (!token) {
      setIsError(true);
    }
  }, [token]);

  const validatePassword = () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return false;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      const response = await mutateResetPassword({
        token: token as string,
        newPassword,
        confirmPassword,
      });   

      if (response?.status === 'success') {
        setIsSuccess(true);
        toast.success('Password updated successfully!');
      } else {
        setIsError(true);
        toast.error(response?.message || 'Failed to reset password');
      }
    } catch (error) {
      setIsError(true);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="tailwind min-h-screen bg-gradient-to-br from-white via-white to-cyan-50/70 flex items-center justify-center px-4 py-12">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 text-brand-blue/10 text-4xl">+</div>
      <div className="absolute bottom-32 right-10 text-brand-blue/10 text-4xl">+</div>

      <div className="w-full max-w-md relative bg-white rounded-3xl shadow-2xl border border-slate-100/50 p-8 md:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo-c.png"
            alt="Vertex9 Systems"
            width={140}
            height={40}
            className="h-12 w-auto"
          />
        </div>

        {/* Error State - No Token */}
        {!token && (
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="p-3 bg-red-50 rounded-full">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Invalid reset link
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                The password reset link is missing a token. Please use the link from your email or request a new one.
              </p>
            </div>
            <button
              onClick={handleGoHome}
              className="btn-gradient-blue w-full text-white font-semibold py-3 rounded-full transition-all duration-300 ease-out hover:shadow-lg hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
            >
              Go to Home
            </button>
          </div>
        )}

        {/* Form State */}
        {token && !isSuccess && !isError && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Create New Password
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                Choose a strong password for your account
              </p>
            </div>

            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-900 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Must be at least 8 characters with mixed case and numbers
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Error Message */}
            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{passwordError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isResetPasswordPending || !newPassword || !confirmPassword}
              className="btn-gradient-blue w-full text-white font-semibold py-3 rounded-full transition-all duration-300 ease-out hover:shadow-lg hover:shadow-brand-blue/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isResetPasswordPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isResetPasswordPending ? 'Resetting...' : 'Reset Password'}
            </button>

            {/* Password Requirements */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Password Requirements:</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                  Contains uppercase and lowercase letters
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                  Contains at least one number
                </li>
              </ul>
            </div>
          </form>
        )}

        {/* Loading State */}
        {token && isResetPasswordPending && (
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Resetting your password
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Please wait while we reset your password. This will only take a moment.
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="p-3 bg-emerald-50 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Password updated successfully!
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Your password has been updated. You can now log in with your new password.
              </p>
            </div>
            <button
              onClick={handleGoHome}
              className="btn-gradient-blue w-full text-white font-semibold py-3 rounded-full transition-all duration-300 ease-out hover:shadow-lg hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
            >
              Go to Home
            </button>
          </div>
        )}

        {/* Error State - Reset Failed */}
        {isError && token && (
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="p-3 bg-red-50 rounded-full">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Password reset failed
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                We could not reset your password. The link may have expired or already been used. Please request a new password reset email.
              </p>
            </div>
            <button
              onClick={handleGoHome}
              className="btn-gradient-blue w-full text-white font-semibold py-3 rounded-full transition-all duration-300 ease-out hover:shadow-lg hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
