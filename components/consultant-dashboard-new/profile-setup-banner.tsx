'use client'

import Link from 'next/link'

interface ProfileSetupBannerProps {
  completionPercentage?: number
  onCompleteClick?: () => void
}

export function ProfileSetupBanner({
  completionPercentage = 64,
  onCompleteClick,
}: ProfileSetupBannerProps) {
  const isComplete = completionPercentage === 100

  const getStatusText = () => {
    if (completionPercentage < 25) return 'Getting started - Step 1 of 4'
    if (completionPercentage < 50) return 'Making progress - Step 2 of 4'
    if (completionPercentage < 75) return 'Almost there - Step 3 of 4'
    if (completionPercentage < 100) return 'Final steps - Step 4 of 4'
    return 'Profile complete'
  }

  const getHeadingText = () => {
    if (isComplete) return 'Profile Complete!'
    return 'Set up your profile'
  }

  const getDescriptionText = () => {
    if (isComplete) {
      return 'Your profile is ready. You can now be matched with clients, receive invoices and schedule interviews.'
    }
    return 'Complete your profile to get matched with clients, receive invoices and schedule interviews.'
  }

  return (
    <div className="w-full mb-4 rounded-xl bg-brand-blue p-6 md:p-8">
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-white/80">{getStatusText()}</p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl md:text-xl font-bold text-white mb-2">
                {getHeadingText()}
              </h2>
              <p className="text-white/90 text-xs">
                {getDescriptionText()}
              </p>
            </div>

            {/* Button */}
            {!isComplete && (
              <Link
                href="/profile"
                onClick={(e) => {
                  if (onCompleteClick) {
                    e.preventDefault()
                    onCompleteClick()
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap text-sm"
              >
                Complete Profile
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {/* <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
          <span className="text-white font-semibold text-sm whitespace-nowrap">
            {completionPercentage}%
          </span>
        </div> */}
        <div className="flex items-center gap-3">
  <div className="flex-1 flex gap-1 h-1">
    {[0, 1, 2, 3].map((i) => {
      const filled = Math.round((Math.min(completionPercentage, 100) / 100) * 4);
      const active = i < filled;
      return (
        <div
          key={i}
          className={`flex-1 h-full transition-all duration-500 ease-out ${
            active ? 'bg-white/55' : 'bg-white/20'
          } ${
            i === 0 ? 'rounded-l-full' : i === 3 ? 'rounded-r-full' : 'rounded-sm'
          }`}
        />
      );
    })}
  </div>

</div>
      </div>
    </div>
  )
}
