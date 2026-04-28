import React from 'react'
import { Badge } from '../homepage/ui/badge'
import { CheckCircle2, Star, CircleStar, Sparkles, Award } from 'lucide-react'

const UserInfo = ({ user, badges }: { user: any, badges: string[] }) => {
  const badgeConfig = {
    VERIFIED: {
      label: "Verified",
      variant: "bg-success" as const,
      startIcon: CheckCircle2,
    },
    CERTIFIED: {
      label: "Certified",
      variant: "bg-brand-blue" as const,
      startIcon: Star,
    },
    JUNIOR: {
      label: "Junior Consultant",
      variant: "bg-gray-100" as const,
      startIcon: Award,
    },
    ASSOCIATE: {
      label: "Associate Consultant",
      variant: "bg-brand-blue" as const,
      startIcon: Star,
    },
    MID_LEVEL: {
      label: "Mid Level",
      variant: "bg-indigo-100" as const,
      startIcon: Star,
    },
    SENIOR: {
      label: "Senior Consultant",
      variant: "bg-purple-100" as const,
      startIcon: CircleStar,
    },
    PRINCIPAL: {
      label: "Principal Consultant",
      variant: "bg-amber-100" as const,
      startIcon: Star,
    },
    SOLUTION_ARCHITECT: {
      label: "Solution Architect",
      variant: "bg-brand-blue" as const,
      startIcon: Sparkles,
    },
  };
  return (
    <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-3xl text-slate-900 mb-2 font-neue">
            {user?.username}
          </h1>
          <div className="flex items-center flex-wrap gap-2">
            {badges.map((badge) => {
              const config = badgeConfig[badge as keyof typeof badgeConfig]
              return config ? (
                <Badge key={badge} className={`${config.variant} !text-white text-xxs font-bold rounded-full flex items-center gap-1 hover:scale-105 transition-all duration-300`}>
                  <config.startIcon className="w-3 h-3" />
                  {config.label}
                </Badge>
              ) : null
            })}
          </div>
        </div>
      </div>
  )
}

export default UserInfo;