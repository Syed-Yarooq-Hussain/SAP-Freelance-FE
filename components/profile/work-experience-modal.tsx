'use client'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Briefcase } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { workExperienceSchema, type WorkExperienceFormData } from '@/lib/schemas/experience'
import { formatDateFieldForInput } from '@/lib/utils/dateFieldDisplay'
import { ProfileFormModalHeader } from '@/components/profile/profile-form-modal-header'

interface WorkExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: WorkExperienceFormData) => Promise<void>
  initialData?: WorkExperienceFormData
}

export function WorkExperienceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: WorkExperienceModalProps) {
  const [mounted, setMounted] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WorkExperienceFormData>({
    resolver: yupResolver(workExperienceSchema) as any,
    defaultValues: {
      ...initialData,
      responsibilities: initialData?.responsibilities || [],
    },
  })

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      reset({
        ...initialData,
        start_date: formatDateFieldForInput(initialData.start_date),
        end_date: formatDateFieldForInput(initialData.end_date),
        responsibilities: initialData.responsibilities || [],
      })
      return
    }
    reset({
      company_name: '',
      position: '',
      start_date: '',
      end_date: '',
      responsibilities: [],
    })
  }, [isOpen, initialData, reset])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const handleClose = () => {
    reset()
    onClose()
  }
  const onSubmit = async (data: WorkExperienceFormData) => {
    try {
      const normalizedData: WorkExperienceFormData = {
        ...data,
        responsibilities: Array.isArray(data.responsibilities)
          ? data.responsibilities.map((line) => String(line).trim()).filter(Boolean)
          : [],
      }
      await onSave(normalizedData)
      handleClose()
    } catch (error) {
      console.error('Error saving work experience:', error)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4" onClick={handleClose}>
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white md:p-8 p-6 shadow-2xl z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >

        <ProfileFormModalHeader
          icon={Briefcase}
          title={initialData ? 'Edit Work Experience' : 'Add Work Experience'}
          subtitle="Fill in your role details to showcase your work experience on your profile."
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('company_name')}
              placeholder="e.g., Tech Solutions Inc."
              className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
            />
            {errors.company_name && (
              <p className="text-xs text-red-500 mt-1">{errors.company_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              {...register('position')}
              placeholder="e.g., Senior SAP Consultant"
              className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
            />
            {errors.position && (
              <p className="text-xs text-red-500 mt-1">{errors.position.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register('start_date')}
                type="text"
                placeholder="2020"
                autoComplete="off"
                className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
              />
              {errors.start_date && (
                <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                End Date
              </label>
              <input
                {...register('end_date')}
                type="text"
                placeholder="2024"
                autoComplete="off"
                className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
              />
              {errors.end_date && (
                <p className="text-xs text-red-500 mt-1">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Responsibilities (one per line)
            </label>
            <Controller
              name="responsibilities"
              control={control}
              render={({ field }) => (
                <textarea
                  placeholder="Enter responsibilities, one per line..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900 resize-none"
                  value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                  onChange={(e) => {
                    // Keep empty lines while typing so Enter/Shift+Enter creates a new line naturally.
                    const lines = e.target.value.split('\n')
                    field.onChange(lines)
                  }}
                />
              )}
            />
            {errors.responsibilities && (
              <p className="text-xs text-red-500 mt-1">{errors.responsibilities.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-slate-300 text-slate-900 font-semibold rounded-input hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 bg-brand-blue text-white font-semibold py-2 rounded-input transition-all hover:shadow-lg hover:shadow-brand-blue/30 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
