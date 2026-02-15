"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

// Tailwind styles (same as home page)
import "@/utils/styles/index.css";

import { useVerifyToken } from "@/actions/auth/useVerifyToken";
import { CustomButton } from "@/components/homepage/ui/CustomButton";

export default function VerifyEmailPage() {
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState('Verifying your email...')
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const {
    mutateAsync: verifyToken,
    isPending,
    isSuccess,
    isError,
  } = useVerifyToken();

  useEffect(() => {
    if (!token) return;

    // Fire verification as soon as user lands on the page
    verifyToken({ token })
    .then((response) => {
        if(response?.status == 'success'){
            setIsVerified(true);
            setMessage('Email verified successfully!');
        }else{
            setMessage(response?.message || 'Something went wrong');            
        }
    })
    .catch((error) => {
      setMessage(error?.message || 'Something went wrong');
      setIsVerified(false);
    });
  }, [token, verifyToken]);

  const handleGoHome = () => {
    router.push("/");
  };

  const hasToken = Boolean(token);

  return (
    <div className="tailwind min-h-screen bg-gradient-to-br from-white via-white to-cyan-50/70 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 text-brand-blue/10 text-4xl">+</div>
        <div className="absolute bottom-32 right-10 text-brand-blue/10 text-4xl">+</div>

        <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100/50 p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/vx9-logo-02.png"
              alt="Vertex9 Systems"
              width={140}
              height={40}
              className="h-12 w-auto"
            />
          </div>

          {/* Content */}
          {!hasToken && (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="p-3 bg-red-50 rounded-full">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Invalid verification link
                </h1>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  The verification link is missing a token. Please use the link
                  from your email or request a new one.
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

          {hasToken && isPending && (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Verifying your email
                </h1>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Please wait while we verify your email address. This will only
                  take a moment.
                </p>
              </div>
            </div>
          )}

          {hasToken && !isPending && isVerified && (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="p-3 bg-emerald-50 rounded-full">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Email verified successfully!
                </h1>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Your email has been verified. You can now log in to your portal.
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

          {hasToken && !isPending && !isVerified && (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="p-3 bg-red-50 rounded-full">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  {message}
                </h1>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  We could not verify this link. It may have expired or already
                  been used. Please request a new verification email or try logging
                  in.
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
    </div>
  );
}
