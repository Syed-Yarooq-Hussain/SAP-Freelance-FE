'use client'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { workExperienceSchema, type WorkExperienceFormData } from '@/lib/schemas/experience'

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
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: WorkExperienceFormData) => {
    try {
      await onSave(data)
      handleClose()
    } catch (error) {
      console.error('Error saving work experience:', error)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4" onClick={handleClose}>
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {initialData ? 'Edit Work Experience' : 'Add Work Experience'}
        </h2>

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
                type="date"
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
                type="date"
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
                    const lines = e.target.value.split('\n').filter(line => line.trim())
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
              className="px-4 btn-gradient-blue text-white font-semibold py-2 rounded-input transition-all hover:shadow-lg hover:shadow-brand-blue/30 disabled:opacity-50"
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
