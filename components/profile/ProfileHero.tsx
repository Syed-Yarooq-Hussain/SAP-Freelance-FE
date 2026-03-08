'use client'

import Image from 'next/image'
import { CheckCircle, FileUp, Heart, Mail, Pencil } from 'lucide-react'
import { useAppSelector } from '@/lib/store/hook'

interface ProfileHeroProps {
  onEdit?: () => void
  onMessage?: () => void
  onAutofillResume?: () => void
  showEdit?: boolean
}

const sanitizeUrl = (url?: string | null) =>
  url ? encodeURI(url.trim()) : undefined

export function ProfileHero({ onEdit, onMessage, onAutofillResume, showEdit = true }: ProfileHeroProps) {
  const user = useAppSelector((state) => state?.user?.user)
  const name = user?.user?.username ?? 'User'
  const profileImage = sanitizeUrl(user?.user?.avatar ?? '')
  const city = user?.user?.city ?? 'N/A'
  const rate = user?.rate ?? 0
  const experience = user?.experience ?? 0
  const primaryModule = user?.user?.modules?.find((m: { is_primary?: boolean }) => m?.is_primary)
  const roleLabel = primaryModule?.module?.name ?? 'N/A'
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Photo */}
        <div className="w-full md:w-[380px] flex-shrink-0 p-4 md:p-5">
          <div className="relative aspect-[4/3] md:aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-md ring-1 ring-slate-200/50">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                <span className="text-4xl font-semibold text-slate-500">{initials}</span>
              </div>
            )}
            {/* Carousel dots (placeholder) */}
            {/* <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div> */}
            {/* <button
              type="button"
              className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 text-red-500 shadow-sm hover:bg-white"
              aria-label="Save"
            >
              <Heart className="w-5 h-5" />
            </button> */}
          </div>
        </div>

        {/* Summary card */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              SAP Consultant
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              {name}
            </h1>
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              {/* <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-amber-400" aria-hidden>★</span>
                ))}
              </div> */}
              {/* <span className="text-sm">(0)</span> */}
            </div>
            <p className="text-slate-700 font-medium mb-2">
              ${rate}/hr · {city}
            </p>
            <p className="text-sm text-slate-600 mb-4">
              {roleLabel} - {experience} yrs exp
            </p>
            

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4 border-t-[1px] border-slate-200 pt-4">
              {user?.badges?.map((badge: string) => {
                const normalized = badge.toUpperCase()
                const isVerified = normalized === 'VERIFIED'
                const isCertified = normalized === 'CERTIFIED'
                return (
                  <span
                    key={badge}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isVerified ? 'Verified' : isCertified ? 'Certified' : badge}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {showEdit && onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 px-3 py-2 border border-brand-blue/80 text-brand-blue font-medium rounded-xl text-xs transition-transform duration-200 hover:scale-105 active:scale-95 hover:bg-brand-blue hover:text-white hover:border-brand-blue"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit profile
              </button>
            )}
            {onAutofillResume && (
              <button
                type="button"
                onClick={onAutofillResume}
                className="inline-flex items-center gap-2 px-3 py-2 border border-brand-blue/80 text-brand-blue font-medium rounded-xl text-xs transition-transform duration-200 hover:scale-105 active:scale-95 hover:bg-brand-blue hover:text-white hover:border-brand-blue"
              >
                <FileUp className="w-3.5 h-3.5" />
                Autofill by Resume
              </button>
            )}
            {/* {onMessage && (
              <button
                type="button"
                onClick={onMessage}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-brand-blue text-brand-blue font-semibold rounded-input hover:bg-brand-blue/5 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Message
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
