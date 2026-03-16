'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CheckCircle, Upload, Info, Badge, Award, Star, Sparkles } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hook'
import { updateUser } from '@/lib/store/features/user/userSlice'
import { getConsultantMeService } from '@/services/getConsultantProfile'
import { request } from '@/utils/request'
import { accountSettingsSchema, type AccountSettingsFormData } from '@/lib/schemas/account-settings'
import { PhotoGuidelinesModal } from './photo-guidelines-modal'
import { toast } from 'sonner'

const sanitizeUrl = (url?: string | null) =>
  url ? encodeURI(url.trim()) : undefined

const PROFILE_PHOTO_GUIDELINES = [
  'Choose a plain background',
  'Face the camera',
  'Wear professional attire',
  'Center your photo around your head and shoulders',
  'Keep your photo natural. Avoid heavy filters or edits to maintain authenticity',
]

interface AccountSettingsProps {
  onSubmit?: (data: any, apiPayload?: any) => void
  isLoading?: boolean
}

export default function AccountSettings({ onSubmit, isLoading = false }: AccountSettingsProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state?.user?.user)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [profileImage, setProfileImage] = useState<string | undefined>(
    sanitizeUrl(user?.user?.avatar) || ''
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AccountSettingsFormData>({
    resolver: yupResolver(accountSettingsSchema) as never,
    defaultValues: {
      name: '',
      phone: '',
      linkedin_profile_url: '',
    },
  })

  useEffect(() => {
    if (user) {
      setValue('name', user?.user?.username ?? (user as any)?.username ?? '')
      setValue(
        'phone',
        (user as any)?.user?.phone ?? (user as any)?.phone ?? ''
      )
      setValue(
        'linkedin_profile_url',
        (user as any)?.user?.linkedin_url ?? (user as any)?.linkedin_url ?? ''
      )
      if (user?.user?.avatar) setProfileImage(sanitizeUrl(user.user.avatar) || '')
    }
  }, [user, setValue])

  const email = user?.user?.email ?? ''
  const initials = (user?.user?.username ?? user?.username ?? 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await request<FormData, { url: string }>({
        url: `/consultants/upload-profile/${user?.user?.id}`,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const url = sanitizeUrl(result?.data?.url)
      if (url) {
        setProfileImage(url)
        const consultantData = await getConsultantMeService()
        if (consultantData?.data) {
          dispatch(updateUser({ user: consultantData.data }))
        }
        toast.success('Profile photo updated')
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to upload photo')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const onFormSubmit = (data: AccountSettingsFormData) => {
    onSubmit?.(null,{ 
        user:{
            username: data.name,
            phone: data.phone,
        }
     })
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100/50 p-6 md:p-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        {/* Badges Left */}
        <div className="flex flex-wrap gap-2">
          {user?.badges?.map((badge: string) => {
            const normalized = badge.toUpperCase();

            const badgeConfig = {
              VERIFIED: {
                label: 'Verified',
                color: 'bg-emerald-100 text-emerald-700',
                icon: CheckCircle,
              },
              CERTIFIED: {
                label: 'Certified',
                color: 'bg-blue-100 text-blue-700',
                icon: Badge,
              },
              EXPERT: {
                label: 'Expert',
                color: 'bg-purple-100 text-purple-700',
                icon: Award,
              },
              SENIOR_EXPERT: {
                label: 'Senior Expert',
                color: 'bg-amber-100 text-amber-700',
                icon: Star,
              },
              SOLUTION_ARCHITECT: {
                label: 'Solution Architect',
                color: 'bg-red-100 text-red-700',
                icon: Sparkles,
              },
            }[normalized];

            if (!badgeConfig) return null;

            const Icon = badgeConfig.icon;

            return (
              <span
                key={badge}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badgeConfig.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {badgeConfig.label}
              </span>
            );
          })}
        </div>
      </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
          {/* Profile Picture */}
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Profile Picture
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-slate-200"
                  />
                ) : (
                    <img
                      src={'/images/placeholder.png'}
                      alt={'user'}
                      className="w-32 h-32 rounded-full object-cover border-2 border-slate-200"
                    />
                )}
              </div>
              <div className="flex-1 space-y-4">
                <label
                  className={`inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium transition-colors ${
                    isUploadingImage
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-50 text-slate-700 cursor-pointer hover:bg-slate-100'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {isUploadingImage ? 'Uploading...' : 'Browse and Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                    aria-label="Upload profile photo"
                  />
                </label>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Guidelines for profile photo:
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {PROFILE_PHOTO_GUIDELINES.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setShowPhotoModal(true)}
                    className="text-sm text-slate-500 hover:text-brand-blue mt-2 underline"
                  >
                    View full guidelines
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-slate-900">
              Basic Information
            </h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Name <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('name')}
                    type="text"
                    placeholder="e.g. John Smith"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                    aria-label="Email (read-only)"
                />
                </div>

                <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                    Contact Number
                    <span
                    className="text-slate-400 cursor-help"
                    title="Your primary contact number"
                    >
                    <Info className="w-4 h-4" />
                    </span>
                </label>
                <input
                    {...register('phone')}
                    type="tel"
                    placeholder="e.g. +1 234 567 8900"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
                {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                    </p>
                )}
                </div>

                <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                    LinkedIn Profile URL
                    <span
                    className="text-slate-400 cursor-help"
                    title="Your public LinkedIn profile link"
                    >
                    <Info className="w-4 h-4" />
                    </span>
                </label>
                <input
                    {...register('linkedin_profile_url')}
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                />
                {errors.linkedin_profile_url && (
                    <p className="mt-1 text-sm text-red-600">
                    {errors.linkedin_profile_url.message}
                    </p>
                )}
                </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gradient-blue text-white font-semibold px-8 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-blue/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <PhotoGuidelinesModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
      />
    </>
  )
}
