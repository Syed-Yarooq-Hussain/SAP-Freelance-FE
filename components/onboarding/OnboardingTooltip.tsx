"use client";

import type { OnboardingTourStepData } from "@/types/onboarding-tour";
import { Check, CheckCircle2, Sparkles, Star } from "lucide-react";
import type { TooltipRenderProps } from "react-joyride";

import { OnboardingTourProgress } from "./OnboardingTourProgress";

const CONFETTI_DOTS = [
  { top: "12%", left: "10%", delay: "0ms", color: "#4A7AB5" },
  { top: "8%", left: "78%", delay: "120ms", color: "#F5B301" },
  { top: "22%", left: "92%", delay: "240ms", color: "#4A7AB5" },
  { top: "68%", left: "6%", delay: "180ms", color: "#7CB87A" },
  { top: "82%", left: "88%", delay: "300ms", color: "#F5B301" },
  { top: "74%", left: "18%", delay: "420ms", color: "#4A7AB5" },
];

export function OnboardingTooltip({
  step,
  index,
  size,
  isLastStep,
  primaryProps,
  tooltipProps,
}: TooltipRenderProps) {
  const data = (step.data ?? {}) as OnboardingTourStepData;
  const variant = data.variant ?? "default";
  const progressTotal = data.progressTotal ?? Math.min(size, 3);
  const primaryLabel =
    data.primaryLabel ?? (variant === "completion" || isLastStep ? "Done" : "Next");

  if (variant === "welcome") {
    return (
      <div
        {...tooltipProps}
        className="pointer-events-auto w-[min(340px,calc(100vw-2rem))] rounded-[22px] border border-slate-200 bg-white px-6 py-6 shadow-[0_12px_40px_rgba(15,23,42,0.14)]"
      >
        <div className="mx-auto mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#4A7AB5] text-white shadow-sm">
          <Star className="h-5 w-5" strokeWidth={2.25} />
        </div>

        {step.title ? (
          <h3 className="text-center font-neue text-lg font-bold leading-snug text-slate-900">
            {step.title}
          </h3>
        ) : null}

        {step.content ? (
          <p className="mt-2 text-center font-manrope text-xs leading-relaxed text-slate-500">
            {step.content}
          </p>
        ) : null}

        <div className="mt-4 flex justify-center">
          <OnboardingTourProgress current={0} total={progressTotal} />
        </div>

        <button
          type="button"
          {...primaryProps}
          className="mt-4 w-full rounded-lg bg-[#4A7AB5] px-4 py-2.5 font-manrope text-xs font-semibold text-white transition-colors hover:bg-[#3d6799]"
        >
          {primaryLabel}
        </button>
      </div>
    );
  }

  if (variant === "completion") {
    const highlights = data.highlights ?? [];

    return (
      <div
        {...tooltipProps}
        className="onboarding-completion-card pointer-events-auto relative w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-[22px] border border-[#4A7AB5]/20 bg-gradient-to-b from-white via-white to-[#eef4fb] px-6 py-6 shadow-[0_16px_48px_rgba(74,122,181,0.22)]"
      >
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          {CONFETTI_DOTS.map((dot, dotIndex) => (
            <span
              key={dotIndex}
              className="onboarding-confetti-dot absolute h-1.5 w-1.5 rounded-full"
              style={{
                top: dot.top,
                left: dot.left,
                backgroundColor: dot.color,
                animationDelay: dot.delay,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="onboarding-completion-check mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-[#4A7AB5] text-white shadow-[0_8px_24px_rgba(74,122,181,0.35)]">
            <Check className="h-6 w-6" strokeWidth={2.75} />
          </div>

          <div className="mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#F5B301]" />
            {step.title ? (
              <h3 className="text-center font-neue text-lg font-bold leading-snug text-slate-900">
                {step.title}
              </h3>
            ) : null}
            <Sparkles className="h-3.5 w-3.5 text-[#F5B301]" />
          </div>

          {data.subtitle ? (
            <p className="text-center font-manrope text-[11px] font-semibold uppercase tracking-wide text-[#4A7AB5]">
              {data.subtitle}
            </p>
          ) : null}

          {step.content ? (
            <p className="mt-2 text-center font-manrope text-xs leading-relaxed text-slate-500">
              {step.content}
            </p>
          ) : null}

          {highlights.length > 0 ? (
            <ul className="mt-4 space-y-2 rounded-xl border border-[#4A7AB5]/10 bg-white/80 px-3 py-3">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 font-manrope text-[11px] leading-snug text-slate-600"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4A7AB5]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            {...primaryProps}
            className="onboarding-completion-cta mt-4 w-full rounded-lg bg-[#4A7AB5] px-4 py-2.5 font-manrope text-xs font-semibold text-white transition-all hover:bg-[#3d6799] hover:shadow-md"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    );
  }

  if (variant === "nav-link") {
    return (
      <div
        {...tooltipProps}
        className="pointer-events-auto w-[min(300px,calc(100vw-2rem))] rounded-xl border border-slate-100 bg-white p-4 shadow-[0_10px_32px_rgba(15,23,42,0.12)]"
      >
        {step.title ? (
          <h3 className="font-neue text-sm font-bold text-slate-900">
            {step.title}
          </h3>
        ) : null}

        {step.content ? (
          <p className="mt-1.5 font-manrope text-xs leading-relaxed text-slate-600">
            {step.content}
          </p>
        ) : null}

        <div className="mt-3.5 flex items-center justify-between gap-3">
          <OnboardingTourProgress current={index} total={progressTotal} />
          <span className="font-manrope text-[11px] font-medium text-slate-400">
            Click highlighted item
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      {...tooltipProps}
      className="pointer-events-auto w-[min(300px,calc(100vw-2rem))] rounded-xl border border-slate-100 bg-white p-4 shadow-[0_10px_32px_rgba(15,23,42,0.12)]"
    >
      {step.title ? (
        <h3 className="font-neue text-sm font-bold text-slate-900">
          {step.title}
        </h3>
      ) : null}

      {step.content ? (
        <p className="mt-1.5 font-manrope text-xs leading-relaxed text-slate-600">
          {step.content}
        </p>
      ) : null}

      <div className="mt-3.5 flex items-center justify-between gap-3">
        <OnboardingTourProgress current={index} total={progressTotal} />
        <button
          type="button"
          {...primaryProps}
          className="shrink-0 rounded-md bg-[#4A7AB5] px-4 py-2 font-manrope text-xs font-semibold text-white transition-colors hover:bg-[#3d6799]"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}
