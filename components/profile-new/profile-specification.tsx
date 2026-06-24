import { CircleCheck, Clock, MapPin } from 'lucide-react'
import React from 'react'

const ProfileSpecification = ({ user }: { user: any }) => {
  const linkedinUrl = '';
  return (
    <div
        className={`grid grid-cols-2  gap-4 mb-4 ${user?.user?.linkedin_url ? "md:grid-cols-5" : "md:grid-cols-4"}`}
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
        {linkedinUrl && (
          <div className="shadow-custom min-h-16 border flex flex-col justify-evenly border-slate-200 rounded-lg px-4 py-2">
            <div className="flex items-center gap-1 text-[10px] text-light-grey font-semibold mb-1 font-manrope">
              LinkedIn
            </div>
            <div className="text-sm text-slate-900 flex items-center gap-1.5 font-manrope">
              <img src="/images/linkedin.png" alt="LinkedIn" className="w-4 h-4" />
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Profile
              </a>
            </div>
          </div>
        )}
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