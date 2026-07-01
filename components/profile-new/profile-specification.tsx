import { CircleCheck, Clock, Linkedin, MapPin, ShieldCheck } from 'lucide-react'
import React from 'react'

const ProfileSpecification = ({ user }: { user: any }) => {
  const linkedinUrl = user?.user?.linkedin_url;
  const isLinkedinConnected = Boolean(user?.user?.loginWithLinkedin);

  return (
    <div
        className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-5"
      >
        <div className="shadow-custom min-h-16 border flex flex-col justify-evenly border-slate-200 rounded-lg px-4 py-2">
          <div className="text-[10px] text-light-grey font-semibold font-manrope">
            Hourly Rate
          </div>
          <div className="text-sm font-bold text-success font-manrope">
            ${user?.rate || "-"}/hr
          </div>
        </div>
        <div className="shadow-custom min-h-16 border flex flex-col justify-evenly border-slate-200 rounded-lg px-4 py-2">
          <div className="text-[10px] text-light-grey font-semibold mb-1 font-manrope">
            Availability (Weekly)
          </div>
          <div className="text-sm flex items-center gap-1.5 font-manrope">
            <Clock className="w-4 h-4" />
            {user?.weekly_available_hours} hours
          </div>
        </div>
        {user?.user?.city && (
          <div className="shadow-custom min-h-16 border flex flex-col justify-evenly border-slate-200 rounded-lg px-4 py-2">
            <div className="flex items-center gap-1 text-[10px] text-light-grey font-semibold mb-1 font-manrope">
              Location
            </div>
            <div className="text-sm text-slate-900 flex items-center gap-1.5 font-manrope">
              <MapPin className="w-4 h-4" />
              {user?.user?.city}
              {/* {user?.user?.country && `, ${user?.user?.country}`} */}
            </div>
          </div>
        )}
        <div className="shadow-custom min-h-16 border flex flex-col justify-evenly border-slate-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-1 text-[10px] text-light-grey font-semibold mb-1 font-manrope">
            LinkedIn
          </div>
          <div className="text-sm text-slate-900 flex flex-col gap-1.5 font-manrope">
            <span className="flex items-center gap-1.5">
              {isLinkedinConnected ? (
                <ShieldCheck className="w-4 h-4 text-success" />
              ) : (
                <Linkedin className="w-4 h-4 text-slate-500" />
              )}
              {isLinkedinConnected
                ? "LinkedIn verified"
                : "LinkedIn not connected"}
            </span>
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-fit text-xs font-semibold text-brand-blue hover:underline"
              >
                View LinkedIn
              </a>
            )}
          </div>
        </div>
        {
          <div className="shadow-custom min-h-16 border flex flex-col justify-evenly border-slate-200 rounded-lg px-4 py-2">
            <div className="flex items-center gap-1 text-[10px] text-light-grey font-semibold mb-1 font-manrope">
              Projects
            </div>
            <div className="text-sm text-slate-900 flex items-center gap-1 font-manrope">
              <CircleCheck className="w-3 h-3" />
              {user?.projects?.length || 0} done
            </div>
          </div>
        }
      </div>
  )
}

export default ProfileSpecification
