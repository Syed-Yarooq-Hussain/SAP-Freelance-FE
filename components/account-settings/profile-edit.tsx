'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Download, HelpCircle, X } from 'lucide-react'
import { accountSchema, type AccountFormData } from '@/lib/schemas/account'
import { PhotoGuidelinesModal } from './photo-guidelines-modal'
import { MultiSelect, type MultiSelectOption } from '@/components/homepage/ui/multi-select'
import { useSapModules } from '@/actions/common/useSapModules'
import { useConsultantMe } from '@/actions/consultants/useConsultantProfile'
import { useAppDispatch, useAppSelector } from '@/lib/store/hook'
import { LocationAutocomplete } from './LocationAutocomplete'
import { request } from '@/utils/request'
import { getConsultantMeService } from '@/services/getConsultantProfile'
import { updateUser } from '@/lib/store/features/user/userSlice'

interface ProfileEditProps {
  onSubmit: (data: AccountFormData, apiPayload?: any) => void
  isLoading?: boolean
  initialData?: Partial<AccountFormData>
  onCancel?: () => void
}

// Transform form data to API payload format
const transformToApiPayload = (formData: AccountFormData, userData?: any) => {
  return {
    user: {
      username: formData.username,
      city: formData.city || '',
    },
    consultant: {
      rate: Number(formData.rate),
      clients_summary: formData.clients_summary || '',
      experience: Number(formData.experience),
      weekly_available_hours: Number(formData.weekly_available_hours),
      skills: userData?.skills || [],
      core_module: Array.isArray(formData.core) 
        ? formData.core.map((id: string) => Number(id))
        : [],
      other_module: Array.isArray(formData.others)
        ? formData.others.map((id: string) => Number(id))
        : [],
    },
  }
}

export function ProfileEdit({
  onSubmit,
  isLoading = false,
  initialData,
  onCancel,
}: ProfileEditProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state?.user?.user)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [profileImage, setProfileImage] = useState<string | undefined>(
    initialData?.profileImage
  )

  const { data, isLoading:loadingSapModules } = useSapModules();
  const modules:any = data?.data

  // Parse module strings to arrays
  const parseModuleString = (moduleStr: string | undefined): string[] => {
    if (!moduleStr) return []
    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(moduleStr)
      if (Array.isArray(parsed)) {
        return parsed.map(m => String(m))
      }
      return []
    } catch {
      // If not JSON, try comma-separated
      return moduleStr.split(',').map(m => m.trim()).filter(Boolean)
    }
  }

  // Get modules from user data - check multiple possible locations
  const getModulesFromUser = () => {
    // Check if modules are in user.user.modules array
    if (Array.isArray(user?.user?.modules) && user.user.modules.length > 0) {
      const coreModules = user.user.modules
        .filter((m: any) => m.is_core)
        .map((m: any) => String(m.id))
      const otherModules = user.user.modules
        .filter((m: any) => !m.is_core)
        .map((m: any) => String(m.id))
      return { core: coreModules, others: otherModules }
    }
    
    // Otherwise parse from module strings
    return {
      core: parseModuleString(user?.user?.module?.core) || [],
      others: parseModuleString(user?.user?.module?.others) || [],
    }
  }

  const userModules = getModulesFromUser()

  const sanitizeUrl = (url?: string | null) =>
    url ? encodeURI(url.trim()) : undefined

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AccountFormData>({
    resolver: yupResolver(accountSchema) as any,
    defaultValues: {
      username: user?.user?.username || '',
      email: user?.user?.email || '',
      city: user?.user?.city || '',
      clients_summary: user?.clients_summary || '',
      rate: user?.rate || 0,
      weekly_available_hours: user?.weekly_available_hours || 0,
      experience: user?.experience || 0,
      
      core: userModules.core,
      others: userModules.others,
      profileImage: sanitizeUrl(initialData?.profileImage || user?.cv_url || ''),
    },
  })

  // Update form values when user data loads
  useEffect(() => {
    if (user) {
      const updatedModules = getModulesFromUser()
      setValue('username', user?.user?.username || '')
      setValue('email', user?.user?.email || '')
      setValue('city', user?.user?.city || '')
      setValue('clients_summary', user?.clients_summary || '')
      setValue('rate', user?.rate || 0)
      setValue('weekly_available_hours', user?.weekly_available_hours || 0)
      setValue('experience', user?.experience || 0)
      
      const coreModules = user?.user?.modules?.length > 0 ? user?.user?.modules.filter((module:any) => module?.is_primary) : []
      const otherModules = user?.user?.modules?.length > 0 ? user?.user?.modules.filter((module:any) => !module?.is_primary) : []
      setValue('core', coreModules.map((module:any) => module?.module?.id))
      setValue('others', otherModules.map((module:any) => module?.module?.id))
      if (user?.user?.avatar) {
        const url = sanitizeUrl(user.user.avatar)
        setProfileImage(url)
        setValue('profileImage', url || '')
      }
    }
  }, [user, setValue])

  const coreModules = watch('core')
  const otherModules = watch('others')
  

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  const result = await request<FormData, { url: string }>({
    url: `/consultants/upload-profile/${user?.user?.id}`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const url = sanitizeUrl(result?.data?.url);
  setProfileImage(url);
  if(url){
    const consultantData = await getConsultantMeService();
        
    if (consultantData?.data) {
      dispatch(updateUser({ user: consultantData.data }));
    }      
  }
  setValue("profileImage", url || '');
};

  const initials = watch('username')
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'JD'
  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100/50 p-6 md:p-8">
        <form onSubmit={handleSubmit((formData) => {
          const payload = transformToApiPayload(formData, user)
          onSubmit(formData, payload)
        })} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 pb-6 border-b border-slate-100">
            <div className="relative flex-shrink-0 group w-20 h-20">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-300 flex items-center justify-center">
                  <span className="text-lg font-semibold text-slate-600">
                    {initials}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-help z-10"
                title="Photo guidelines"
              >
                <HelpCircle className="w-6 h-6 text-white" />
              </button>
              <label className="absolute bottom-0 right-0 w-6 h-6 bg-brand-blue rounded-full cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <span className="text-white text-xl">+</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label="Upload profile image"
                />
              </label>
            </div>

            <div className="flex-1">
              <input
                {...register('username')}
                type="text"
                placeholder="Full Name"
                className="w-full text-lg md:text-xl font-semibold text-slate-900 pb-1 bg-transparent border-b border-slate-300 focus:outline-none focus:border-brand-blue"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
              )}

              <p className="w-full text-sm text-slate-600 mt-2 pb-1">
                {watch('email') || 'email@example.com'}
              </p>

              <textarea
                {...register('clients_summary')}
                placeholder="Profile headline"
                rows={2}
                className="w-full md:w-1/2 max-w-full text-xs text-slate-500 bg-transparent border rounded-xl border-slate-300 mt-2 px-2 py-3 focus:outline-none focus:border-brand-blue placeholder-slate-400 resize-none"
              />
              {errors.clients_summary && (
                <p className="text-xs text-red-500 mt-1">{errors.clients_summary.message}</p>
              )}
            </div>
          </div>

         
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Core Modules */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Core Modules <span className="text-red-500">*</span>
            </label>
            <MultiSelect
              options={modules?.core?.length > 0 ? modules.core.map((module:any) => ({ label: module.name, value: module.id })) : []}
              value={coreModules || []}
              onChange={(selected) => setValue('core', selected)}
              placeholder="Select core modules"
            />
            {errors.core && (
              <p className="text-xs text-red-500 mt-2">
                {errors.core.message}
              </p>
            )}
          </div>

          {/* Other Modules */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Other Modules
            </label>
            <MultiSelect
              options={data?.data?.others ? data.data.others.map((module) => ({ label: module.name, value: module.id })) : []}
              value={otherModules || []}
              onChange={(selected) => setValue('others', selected)}
              placeholder="Select other modules"
            />
          </div>

            {/* Weekly Available Hours */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Weekly Available Hours <span className="text-red-500">*</span>
              </label>
              <input
                {...register('weekly_available_hours')}
                type="number"
                placeholder="20"
                className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue"
              />
              {errors.weekly_available_hours && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.weekly_available_hours.message}
                </p>
              )}
            </div>

              {/* Rate */}
              <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Rate ($/Hr) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('rate')}
                type="number"
                placeholder="80"
                className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue"
              />
              {errors.rate && (
                <p className="text-xs text-red-500 mt-1">{errors.rate.message}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Experience (Years) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('experience')}
                type="number"
                placeholder="5"
                className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue"
              />
              {errors.experience && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <LocationAutocomplete
                value={watch('city')}
                onChange={(value) => setValue('city', value)}
                placeholder="e.g., Berlin"
              />
              {/* <input
                {...register('city')}
                type="text"
                placeholder="e.g., Berlin"
                className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue"
              /> */}
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.city?.message}
                </p>
              )}
            </div>

          </div>

          {/* Working Schedule */}
          {/* <div className="border-t border-slate-100 pt-6">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Working Schedule
            </label>
            <div className="space-y-3">
              {workingSchedule.weekly.map((daySchedule: any, index: number) => (
                <div key={daySchedule.day} className="flex items-center gap-4 p-3 border border-slate-200 rounded-input">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <input
                      type="checkbox"
                      checked={daySchedule.active || false}
                      onChange={(e) => {
                        const updated = [...workingSchedule.weekly]
                        updated[index] = { ...updated[index], active: e.target.checked }
                        setValue('working_schedule', { ...workingSchedule, weekly: updated })
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <label className="text-sm font-medium text-slate-900">{daySchedule.day}</label>
                  </div>
                  {daySchedule.active && (
                    <div className="flex-1 flex gap-2 items-center">
                      <input
                        type="time"
                        value={daySchedule.slot?.[0]?.start || '09:00'}
                        onChange={(e) => {
                          const updated = [...workingSchedule.weekly]
                          const slot = updated[index].slot?.[0] || { start: '09:00', end: '17:00' }
                          updated[index] = {
                            ...updated[index],
                            slot: [{ ...slot, start: e.target.value }]
                          }
                          setValue('working_schedule', { ...workingSchedule, weekly: updated })
                        }}
                        className="px-3 py-1.5 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-sm"
                      />
                      <span className="text-slate-500">to</span>
                      <input
                        type="time"
                        value={daySchedule.slot?.[0]?.end || '17:00'}
                        onChange={(e) => {
                          const updated = [...workingSchedule.weekly]
                          const slot = updated[index].slot?.[0] || { start: '09:00', end: '17:00' }
                          updated[index] = {
                            ...updated[index],
                            slot: [{ ...slot, end: e.target.value }]
                          }
                          setValue('working_schedule', { ...workingSchedule, weekly: updated })
                        }}
                        className="px-3 py-1.5 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center md:justify-start gap-3 border-t border-slate-100 pt-6">
           {onCancel && <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-2.5 border-2 border-slate-300 text-slate-900 font-semibold rounded-full hover:bg-slate-50 transition-all duration-300"
            >
              Cancel
            </button>}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gradient-blue text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 ease-out hover:shadow-lg hover:shadow-brand-blue/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
            {/* <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-2.5 border-2 border-slate-300 text-slate-900 font-semibold rounded-full hover:bg-slate-50 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Download
            </button> */}
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
