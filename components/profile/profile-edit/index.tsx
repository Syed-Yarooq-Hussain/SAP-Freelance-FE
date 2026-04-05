'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, type Resolver, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  profileEditSchema,
  buildProfileEditDefaults,
  type ProfileEditFormData,
} from '@/lib/schemas/profile-edit'
import { useAppDispatch, useAppSelector } from '@/lib/store/hook'
import { updateUser } from '@/lib/store/features/user/userSlice'
import { getConsultantMeService } from '@/services/getConsultantProfile'
import { request } from '@/utils/request'
import { sanitizeUrl } from '@/utils/common'
import {
  AlignLeft,
  Award,
  Briefcase,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  FolderKanban,
  GraduationCap,
  MapPin,
  Plus,
  Trash2,
  Upload,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const inputSurfaceClass =
  'bg-background-main border-slate-200 focus:ring-[#3088B7] focus:border-[#3088B7]'

export default function ProfileEditPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user: consultant } = useAppSelector((state) => state.user)
  const defaultValues = useMemo(() => buildProfileEditDefaults(consultant), [consultant])
  const nestedUser = (consultant as { user?: { id?: number; avatar?: string; username?: string } } | null)
    ?.user
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    keyLocations: true,
    professionalSummary: true,
    experience: true,
    workExperience: true,
    certifications: true,
    education: true,
    projects: true,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
  } = useForm<ProfileEditFormData>({
    resolver: yupResolver(profileEditSchema) as Resolver<ProfileEditFormData>,
    defaultValues,
    mode: 'onBlur',
  })

  useEffect(() => {
    reset(buildProfileEditDefaults(consultant))
  }, [consultant, reset])

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const cvUrl = watch('cv_url')
  const usernameW = watch('username')
  const emailW = watch('email')
  const serverAvatar = sanitizeUrl(nestedUser?.avatar)
  const headerAvatarSrc = photoPreview || serverAvatar
  const headerInitial = (usernameW || nestedUser?.username || '?').trim().charAt(0).toUpperCase() || '?'

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5 MB.')
      return
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      alert('Please use JPG, PNG, or WebP.')
      return
    }
    if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    const blobUrl = URL.createObjectURL(file)
    setPhotoPreview(blobUrl)

    const formData = new FormData()
    formData.append('file', file)
    try {
      const result = await request<FormData, { url: string }>({
        url: `/consultants/upload-profile/${nestedUser?.id}`,
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (sanitizeUrl(result?.data?.url)) {
        const consultantData = await getConsultantMeService()
        if (consultantData?.data) dispatch(updateUser({ user: consultantData.data }))
        setPhotoPreview((prev) => {
          if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
          return null
        })
      }
    } catch {
      // keep blob preview so the user can retry
    }
  }

  const clearLocalPhotoPreview = () => {
    if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDiscard = () => {
    clearLocalPhotoPreview()
    reset(buildProfileEditDefaults(consultant))
  }

  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
    control,
    name: 'work_experiences',
  })

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: 'certifications',
  })

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: 'educations',
  })

  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
    control,
    name: 'projects',
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const onSubmit: SubmitHandler<ProfileEditFormData> = (data) => {
    console.log('Form submitted:', data)
    alert('Profile updated successfully!')
  }

  const InputField = ({
    label,
    name,
    type = 'text',
    required = false,
    error,
    placeholder = '',
    ...rest
  }: any) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        {...rest}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className={`w-full px-3 py-2 border rounded-lg font-manrope focus:outline-none focus:ring-2 focus:ring-[#3088B7] ${error ? 'border-red-500' : 'border-slate-300'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )

  const TextAreaField = ({ label, required = false, error, ...rest }: any) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...rest}
        className={`w-full px-3 py-2 border rounded-lg font-manrope focus:outline-none focus:ring-2 focus:ring-[#3088B7] ${error ? 'border-red-500' : 'border-slate-300'} resize-none`}
        rows={4}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )

  const SectionHeader = ({ title, section }: { title: string; section: keyof typeof expandedSections }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-100/80 transition"
    >
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-slate-600" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-600" />
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-background-main pb-12 font-manrope">
      {/* Header */}
      <div className="bg-background-main border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-2 bg-[#3088B7] text-white rounded-xl hover:bg-[#0891B2] transition font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Basic Information */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-background-main">
          <SectionHeader title="Basic Information" section="basicInfo" />
          {expandedSections.basicInfo && (
            <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  type="text"
                  required
                  error={errors.username?.message}
                  {...register('username')}
                />
                <InputField
                  label="Email"
                  type="email"
                  required
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
              <InputField
                label="Phone"
                type="tel"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          )}
        </div>

        {/* Key Locations */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-background-main">
          <SectionHeader title="Key Locations" section="keyLocations" />
          {expandedSections.keyLocations && (
            <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="City"
                  type="text"
                  error={errors.city?.message}
                  {...register('city')}
                />
                <InputField
                  label="Country"
                  type="text"
                  error={errors.country?.message}
                  {...register('country')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Professional Summary */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-background-main">
          <SectionHeader title="Professional Summary" section="professionalSummary" />
          {expandedSections.professionalSummary && (
            <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-4">
              <TextAreaField
                label="Professional Summary"
                placeholder="Describe your professional background and expertise..."
                error={errors.clients_summary?.message}
                {...register('clients_summary')}
              />
              <p className="text-xs text-slate-500">Maximum 2000 characters</p>
            </div>
          )}
        </div>

        {/* Experience & Rate */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-background-main">
          <SectionHeader title="Experience & Rate" section="experience" />
          {expandedSections.experience && (
            <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Years of Experience"
                  type="number"
                  error={errors.experience?.message}
                  {...register('experience')}
                />
                <InputField
                  label="Hourly Rate ($)"
                  type="number"
                  step="0.01"
                  error={errors.rate?.message}
                  {...register('rate')}
                />
                <InputField
                  label="Weekly Available Hours"
                  type="number"
                  error={errors.weekly_available_hours?.message}
                  {...register('weekly_available_hours')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">CV/Resume</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#3088B7] transition cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Upload CV/Resume</p>
                </div>
                {cvUrl ? (
                  <p className="text-xs text-slate-500 mt-2">
                    Current:{' '}
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3088B7] underline"
                    >
                      View CV
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Work Experience */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-background-main">
          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-100/80 transition">
            <button
              type="button"
              onClick={() => toggleSection('workExperience')}
              className="flex-1 text-left flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold text-slate-900">Work Experience</h2>
              {expandedSections.workExperience ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>

          {expandedSections.workExperience && (
            <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-6">
              {workFields.map((field, index) => (
                <div key={field.id} className="bg-background-main p-4 rounded-lg border border-slate-200 relative">
                  <button
                    type="button"
                    onClick={() => removeWork(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                    <InputField
                      label="Company Name"
                      required
                      error={errors.work_experiences?.[index]?.company_name?.message}
                      {...register(`work_experiences.${index}.company_name`)}
                    />
                    <InputField
                      label="Position"
                      required
                      error={errors.work_experiences?.[index]?.position?.message}
                      {...register(`work_experiences.${index}.position`)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField
                      label="Start Date"
                      type="date"
                      required
                      error={errors.work_experiences?.[index]?.start_date?.message}
                      {...register(`work_experiences.${index}.start_date`)}
                    />
                    <InputField
                      label="End Date"
                      type="date"
                      error={errors.work_experiences?.[index]?.end_date?.message}
                      {...register(`work_experiences.${index}.end_date`)}
                    />
                  </div>

                  <TextAreaField
                    label="Responsibilities"
                    placeholder="List your key responsibilities (one per line)"
                    error={errors.work_experiences?.[index]?.responsibilities?.message}
                    {...register(`work_experiences.${index}.responsibilities`)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  appendWork({
                    company_name: '',
                    position: '',
                    start_date: '',
                    end_date: '',
                    responsibilities: [],
                  })
                }
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-[#3088B7] hover:border-[#3088B7] transition"
              >
                <Plus className="w-4 h-4" />
                Add Work Experience
              </button>
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-background-main">
          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-100/80 transition">
            <button
              type="button"
              onClick={() => toggleSection('certifications')}
              className="flex-1 text-left flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold text-slate-900">Certifications</h2>
              {expandedSections.certifications ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>

          {expandedSections.certifications && (
            <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-6">
              {certFields.map((field, index) => (
                <div key={field.id} className="bg-background-main p-4 rounded-lg border border-slate-200 relative">
                  <button
                    type="button"
                    onClick={() => removeCert(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                    <InputField
                      label="Certification Name"
                      required
                      error={errors.certifications?.[index]?.certification_name?.message}
                      {...register(`certifications.${index}.certification_name`)}
                    />
                    <InputField
                      label="Issuing Organization"
                      required
                      error={errors.certifications?.[index]?.issuing_organization?.message}
                      {...register(`certifications.${index}.issuing_organization`)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Issue Date"
                      type="date"
                      required
                      error={errors.certifications?.[index]?.issue_date?.message}
                      {...register(`certifications.${index}.issue_date`)}
                    />
                    <InputField
                      label="Expiration Date"
                      type="date"
                      error={errors.certifications?.[index]?.expiration_date?.message}
                      {...register(`certifications.${index}.expiration_date`)}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  appendCert({
                    certification_name: '',
                    issuing_organization: '',
                    issue_date: '',
                    expiration_date: '',
                  })
                }
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-[#3088B7] hover:border-[#3088B7] transition"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </button>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-background-main">
          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-100/80 transition">
            <button
              type="button"
              onClick={() => toggleSection('education')}
              className="flex-1 text-left flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold text-slate-900">Education</h2>
              {expandedSections.education ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>

          {expandedSections.education && (
            <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-6">
              {eduFields.map((field, index) => (
                <div key={field.id} className="bg-background-main p-4 rounded-lg border border-slate-200 relative">
                  <button
                    type="button"
                    onClick={() => removeEdu(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                    <InputField
                      label="Institution Name"
                      required
                      error={errors.educations?.[index]?.institution_name?.message}
                      {...register(`educations.${index}.institution_name`)}
                    />
                    <InputField
                      label="Degree"
                      required
                      error={errors.educations?.[index]?.degree?.message}
                      {...register(`educations.${index}.degree`)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField
                      label="Start Date"
                      type="date"
                      required
                      error={errors.educations?.[index]?.start_date?.message}
                      {...register(`educations.${index}.start_date`)}
                    />
                    <InputField
                      label="End Date"
                      type="date"
                      error={errors.educations?.[index]?.end_date?.message}
                      {...register(`educations.${index}.end_date`)}
                    />
                  </div>

                  <TextAreaField
                    label="Details/Course"
                    placeholder="Add course details or specialization"
                    error={errors.educations?.[index]?.details?.message}
                    {...register(`educations.${index}.details`)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  appendEdu({
                    institution_name: '',
                    degree: '',
                    start_date: '',
                    end_date: '',
                    details: [],
                  })
                }
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-[#3088B7] hover:border-[#3088B7] transition"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-background-main">
          <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-100/80 transition">
            <button
              type="button"
              onClick={() => toggleSection('projects')}
              className="flex-1 text-left flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
              {expandedSections.projects ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>

          {expandedSections.projects && (
            <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-6">
              {projFields.map((field, index) => (
                <div key={field.id} className="bg-background-main p-4 rounded-lg border border-slate-200 relative">
                  <button
                    type="button"
                    onClick={() => removeProj(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                    <InputField
                      label="Project Name"
                      required
                      error={errors.projects?.[index]?.project_name?.message}
                      {...register(`projects.${index}.project_name`)}
                    />
                    <InputField
                      label="Client Name"
                      required
                      error={errors.projects?.[index]?.client_name?.message}
                      {...register(`projects.${index}.client_name`)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField
                      label="Start Date"
                      type="date"
                      required
                      error={errors.projects?.[index]?.start_date?.message}
                      {...register(`projects.${index}.start_date`)}
                    />
                    <InputField
                      label="End Date"
                      type="date"
                      error={errors.projects?.[index]?.end_date?.message}
                      {...register(`projects.${index}.end_date`)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField
                      label="Budget ($)"
                      type="number"
                      step="0.01"
                      error={errors.projects?.[index]?.budget?.message}
                      {...register(`projects.${index}.budget`)}
                    />
                    <InputField
                      label="Status"
                      error={errors.projects?.[index]?.status?.message}
                      {...register(`projects.${index}.status`)}
                    />
                  </div>

                  <TextAreaField
                    label="Project Summary"
                    required
                    placeholder="Describe the project scope and outcomes..."
                    error={errors.projects?.[index]?.project_summary?.message}
                    {...register(`projects.${index}.project_summary`)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  appendProj({
                    project_name: '',
                    client_name: '',
                    project_summary: '',
                    start_date: '',
                    end_date: '',
                    budget: null,
                    status: '',
                  })
                }
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-[#3088B7] hover:border-[#3088B7] transition"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
