type OnboardingTourProgressProps = {
  current: number;
  total: number;
};

export function OnboardingTourProgress({
  current,
  total,
}: OnboardingTourProgressProps) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={
            index === current
              ? "h-1 w-5 rounded-full bg-[#4A7AB5]"
              : "h-1.5 w-1.5 rounded-full bg-slate-200"
          }
        />
      ))}
    </div>
  );
}
