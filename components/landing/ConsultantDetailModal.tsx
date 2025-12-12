"use client";

import { APP_ROUTES } from "@/utils/app_routes";
import { X, Lock } from "lucide-react";

interface ConsultantDetailModalProps {
  consultant: { name: string };
  onClose: () => void;
}

const benefits = [
  "View complete consultant profiles and portfolios",
  "Contact consultants and schedule interviews",
  "Post projects and receive proposals",
  "Track project progress in real-time",
];

export function ConsultantDetailModal({
  consultant,
  onClose,
}: ConsultantDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-4 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-7 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-9 h-9 text-blue-600" />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold mb-2">
            Sign Up to View Full Profile
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            You’re trying to view{" "}
            <span className="text-gray-900">{consultant.name}’s</span> full
            profile. Create an account to access detailed information,
            portfolio, and contact options.
          </p>

          {/* BENEFITS */}
          <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">
            <p className="text-gray-700 text-sm mb-4">
              With a free account, you can:
            </p>

            <ul className="space-y-3">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  {/* Green checkmark icon */}
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="text-sm text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA BUTTONS */}
          <div className="space-y-3">
            {/* Primary Button */}
            <button
              onClick={() => {
                window.location.href = (APP_ROUTES.SIGNUP_SELECT);
              }}
              className="w-full py-3 text-white rounded-lg text-sm font-medium
              bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700
              shadow-md hover:shadow-lg transition"
            >
              Create Free Account
            </button>

            {/* Secondary Button */}
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              Maybe Later
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Free to join • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
