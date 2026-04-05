'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, CheckCircle2, Clock, Pause } from 'lucide-react'
import { ProjectsModal } from './projects-modal'
import { type ProjectFormData } from '@/lib/schemas/projects'
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal'
import { Button } from '../homepage/ui/button'

interface ProjectsTabProps {
  data: ProjectFormData[]
  onAdd: (data: ProjectFormData) => Promise<void>
  onEdit: (index: number, data: ProjectFormData) => Promise<void>
  onDelete: (index: number) => Promise<void>
}

const formatMonthYear = (value?: string | null) => {
  if (!value) return ''
  const normalized = value.trim().toLowerCase()
  if (normalized === 'current' || normalized === 'present') return 'Present'

  const parsed = new Date(value as any)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }

  return value
}

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'active':
      return (
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-success rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-3 h-3" />
          Active
        </div>
      )
    case 'completed':
      return (
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-brand-blue rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </div>
      )
    case 'paused':
      return (
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-amber-600 rounded-full text-xs font-semibold">
          <Pause className="w-3 h-3" />
          Paused
        </div>
      )
    default:
      return null
  }
}

export function ProjectsTab({
  data,
  onAdd,
  onEdit,
  onDelete,
}: ProjectsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<ProjectFormData | undefined>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const handleAddClick = () => {
    setEditingIndex(null)
    setEditingData(undefined)
    setIsModalOpen(true)
  }

  const handleEditClick = (index: number, item: ProjectFormData) => {
    setEditingIndex(index)
    setEditingData(item)
    setIsModalOpen(true)
  }

  const handleSave = async (formData: ProjectFormData) => {
    if (editingIndex !== null) {
      await onEdit(editingIndex, formData)
    } else {
      await onAdd(formData)
    }
  }

  const handleDelete = (index: number) => {
    setDeleteIndex(index)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteIndex === null) return
    await onDelete(deleteIndex)
    setIsDeleteOpen(false)
    setDeleteIndex(null)
  }
  return (
    <div className="space-y-3">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={handleAddClick}
          className="inline-flex items-center text-xs gap-2 px-4 py-2 bg-brand-blue text-white font-semibold rounded-xl transition-all "
        >
          <Plus className="w-3 h-3" />
          Add Project
        </button>
      </div>

      {data?.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-12 bg-brand-yellow rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-600 mb-4 text-sm">No projects added yet</p>
          <Button
            onClick={handleAddClick} 
            className='bg-brand-blue text-white flex items-center gap-1 text-xs'
          >
            <Plus className="w-3 h-3" /> Add Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data?.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold font-syne text-slate-900">{item.project_name || '-'}</h4>
                  <p className="text-xs text-slate-600 mt-1">{item.client_name || ''}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(index, item)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                {(item.project_summary ?? item?.summary) || '-'}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                <span>
                  {item?.start_date ? formatMonthYear(item.start_date as any) : ''}{' '}
                  {item?.end_date ? '-' : ''}{' '}
                  {item.end_date ? formatMonthYear(item.end_date as any) : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingData}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        message="Are you sure you want to delete this project?"
        onCancel={() => {
          setIsDeleteOpen(false)
          setDeleteIndex(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
