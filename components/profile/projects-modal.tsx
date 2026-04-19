'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FolderKanban } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { projectSchema, type ProjectFormData } from '@/lib/schemas/projects'
import { formatDateFieldForInput } from '@/lib/utils/dateFieldDisplay'
import { ProfileFormModalHeader } from '@/components/profile/profile-form-modal-header'

interface ProjectsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ProjectFormData) => Promise<void>
  initialData?: ProjectFormData
}

type ProjectPayload = ProjectFormData & {
  budget?: number | null | ''
  technologies?: string[] | string | null
  status?: string
}

export function ProjectsModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ProjectsModalProps) {
  const [mounted, setMounted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema) as any,
    defaultValues: {
      ...initialData,
      start_date: formatDateFieldForInput(initialData?.start_date as any),
      end_date: formatDateFieldForInput(initialData?.end_date as any),
    },
  })

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      reset({
        ...initialData,
        start_date: formatDateFieldForInput(initialData.start_date as any),
        end_date: formatDateFieldForInput(initialData.end_date as any),
      })
      return
    }
    reset({
      project_name: '',
      client_name: '',
      project_summary: '',
      start_date: '',
      end_date: '',
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

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const payload = data as ProjectPayload
      const normalizedData: ProjectFormData = {
        ...payload,
        project_name: payload.project_name?.trim() || '',
        client_name: payload.client_name?.trim() || '',
        project_summary: payload.project_summary?.trim() || '',
        start_date: payload.start_date || '',
        end_date: payload.end_date || '',
      }

      const rawBudget = payload.budget as unknown
      if (rawBudget === '' || rawBudget === null || rawBudget === undefined) {
        ;(normalizedData as any).budget = null
      } else {
        const budgetNumber = Number(rawBudget)
        ;(normalizedData as any).budget = Number.isNaN(budgetNumber) ? null : budgetNumber
      }

      const rawTechnologies = payload.technologies
      if (Array.isArray(rawTechnologies)) {
        ;(normalizedData as any).technologies = rawTechnologies.filter((t) => String(t).trim())
      } else if (typeof rawTechnologies === 'string') {
        ;(normalizedData as any).technologies = rawTechnologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      } else {
        ;(normalizedData as any).technologies = []
      }

      ;(normalizedData as any).status = payload.status || 'active'

      await onSave(normalizedData)
      handleClose()
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4" onClick={handleClose}>
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        <ProfileFormModalHeader
          icon={FolderKanban}
          title={initialData ? 'Edit Project' : 'Add Project'}
          subtitle="Fill in project details to highlight your client delivery work on your profile."
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('project_name')}
              placeholder="e.g. SAP HANA Finance Implementation"
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-blue text-slate-900"
            />
            {errors.project_name && (
              <p className="text-xs text-red-500 mt-1">{errors.project_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('client_name')}
              placeholder="e.g. TechCorp Industries"
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-blue text-slate-900"
            />
            {errors.client_name && (
              <p className="text-xs text-red-500 mt-1">{errors.client_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Project Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('project_summary')}
              placeholder="Briefly describe the project scope, your role, and key outcomes..."
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-blue text-slate-900 resize-none"
            />
            {errors.project_summary && (
              <p className="text-xs text-red-500 mt-1">{errors.project_summary.message}</p>
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
                placeholder="e.g. Q1 2021 or 2021-01-01"
                autoComplete="off"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-blue text-slate-900"
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
                placeholder="e.g. Jun 2024, Present, or leave blank"
                autoComplete="off"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-blue text-slate-900"
              />
              {errors.end_date && (
                <p className="text-xs text-red-500 mt-1">{errors.end_date.message}</p>
              )}
            </div>
          </div>


          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-slate-300 text-slate-900 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-brand-blue/30 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
