'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Award } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { certificationSchema, type CertificationFormData } from '@/lib/schemas/certification'
import { formatDateFieldForInput } from '@/lib/utils/dateFieldDisplay'
import { ProfileFormModalHeader } from '@/components/profile/profile-form-modal-header'

interface CertificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CertificationFormData) => Promise<void>
  initialData?: CertificationFormData
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
      issue_date: formatDateFieldForInput(initialData?.issue_date),
      expiration_date: formatDateFieldForInput(initialData?.expiration_date),
    },
  })

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      reset({
        ...initialData,
        issue_date: formatDateFieldForInput(initialData.issue_date),
        expiration_date: formatDateFieldForInput(initialData.expiration_date),
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
        className="relative w-full max-w-2xl rounded-2xl bg-white md:p-8 p-6 shadow-2xl z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        <ProfileFormModalHeader
          icon={Award}
          title={initialData ? 'Edit Certification' : 'Add Certification'}
          subtitle="Fill in your credential details to showcase your certifications on your profile."
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Certification <span className="text-red-500">*</span>
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
                Institution <span className="text-red-500">*</span>
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

          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register('issue_date')}
                type="text"
                placeholder="2020"
                autoComplete="off"
                className="w-full px-4 py-2 border border-slate-300 rounded-input focus:outline-none focus:border-brand-blue text-slate-900"
              />
              {errors.issue_date && (
                <p className="text-xs text-red-500 mt-1">{errors.issue_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                End Date
              </label>
              <input
                {...register('expiration_date')}
                type="text"
                placeholder="2024"
                autoComplete="off"
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
