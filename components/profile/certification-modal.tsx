'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { certificationSchema, type CertificationFormData } from '@/lib/schemas/certification'

interface CertificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CertificationFormData) => Promise<void>
  initialData?: CertificationFormData
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

export function CertificationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CertificationModalProps) {
  const [mounted, setMounted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CertificationFormData>({
    resolver: yupResolver(certificationSchema) as any,
    defaultValues: {
      ...initialData,
      issue_date: toDateInputValue(initialData?.issue_date),
      expiration_date: toDateInputValue(initialData?.expiration_date),
    },
  })

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      reset({
        ...initialData,
        issue_date: toDateInputValue(initialData.issue_date),
        expiration_date: toDateInputValue(initialData.expiration_date),
      })
      return
    }
    reset({
      certification_name: '',
      issuing_organization: '',
      issue_date: '',
      expiration_date: '',
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

  const onSubmit = async (data: CertificationFormData) => {
    try {
      await onSave(data)
      handleClose()
    } catch (error) {
      console.error('Error saving certification:', error)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4" onClick={handleClose}>
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
    

        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {initialData ? 'Edit Certification' : 'Add Certification'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Certification Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('certification_name')}
              placeholder="e.g., SAP Certified Associate – SAP Analytics Cloud"
              className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
            />
            {errors.certification_name && (
              <p className="text-xs text-red-500 mt-1">{errors.certification_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Issuing Organization <span className="text-red-500">*</span>
            </label>
            <input
              {...register('issuing_organization')}
              placeholder="e.g., SAP"
              className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
            />
            {errors.issuing_organization && (
              <p className="text-xs text-red-500 mt-1">{errors.issuing_organization.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register('issue_date')}
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
              />
              {errors.issue_date && (
                <p className="text-xs text-red-500 mt-1">{errors.issue_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Expiration Date
              </label>
              <input
                {...register('expiration_date')}
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
              />
              {errors.expiration_date && (
                <p className="text-xs text-red-500 mt-1">{errors.expiration_date.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className=" px-4 py-2 border border-slate-300 text-slate-900 font-semibold rounded-input hover:bg-slate-50 transition-colors"
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
