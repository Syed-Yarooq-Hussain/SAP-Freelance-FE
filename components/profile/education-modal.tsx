'use client'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { educationSchema, type EducationFormData } from '@/lib/schemas/education'

interface EducationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EducationFormData) => Promise<void>
  initialData?: EducationFormData
}

const toDateInputValue = (value?: string | null) => {
  if (!value) return ''
  const normalized = value.trim().toLowerCase()
  if (normalized === 'current' || normalized === 'present') {
    return new Date().toISOString().split('T')[0]
  }

  const directDatePattern = /^\d{4}-\d{2}-\d{2}$/
  if (directDatePattern.test(value)) return value

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    const monthYearMatch = value.match(/^([a-zA-Z]+)\s+(\d{4})$/)
    if (!monthYearMatch) return ''
    const fallback = new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`)
    if (Number.isNaN(fallback.getTime())) return ''
    return fallback.toISOString().split('T')[0]
  }

  return parsed.toISOString().split('T')[0]
}

export function EducationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EducationModalProps) {
  const [mounted, setMounted] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EducationFormData>({
    resolver: yupResolver(educationSchema) as any,
    defaultValues: {
      ...initialData,
      start_date: toDateInputValue(initialData?.start_date),
      end_date: toDateInputValue(initialData?.end_date),
      details: initialData?.details || [],
    },
  })

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      reset({
        ...initialData,
        start_date: toDateInputValue(initialData.start_date),
        end_date: toDateInputValue(initialData.end_date),
        details: initialData.details || [],
      })
      return
    }
    reset({
      institution_name: '',
      degree: '',
      start_date: '',
      end_date: '',
      details: [],
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

  const onSubmit = async (data: EducationFormData) => {
    try {
      await onSave(data)
      handleClose()
    } catch (error) {
      console.error('Error saving education:', error)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4" onClick={handleClose}>
      <div 
        className="relative w-full max-w-4xl rounded-2xl bg-white p-8 shadow-2xl z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {initialData ? 'Edit Education' : 'Add Education'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Institution Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('institution_name')}
              placeholder="e.g., Stanford University"
              className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
            />
            {errors.institution_name && (
              <p className="text-xs text-red-500 mt-1">{errors.institution_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Degree <span className="text-red-500">*</span>
            </label>
            <input
              {...register('degree')}
              placeholder="e.g., Bachelor of Science"
              className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
            />
            {errors.degree && (
              <p className="text-xs text-red-500 mt-1">{errors.degree.message}</p>
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
              Details
            </label>
            <Controller
              name="details"
              control={control}
              render={({ field }) => (
                <textarea
                  placeholder="Enter details..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900 resize-none"
                  value={Array.isArray(field.value) ? field.value.join(' ') : ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value ? [value] : [])
                  }}
                />
              )}
            />
            {errors.details && (
              <p className="text-xs text-red-500 mt-1">{errors.details.message}</p>
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
