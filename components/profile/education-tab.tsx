'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, ArchiveX, GraduationCap } from 'lucide-react'
import { EducationModal } from './education-modal'
import { type EducationFormData } from '@/lib/schemas/education'
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal'
import { Button } from '../homepage/ui/button'

interface EducationTabProps {
  data: EducationFormData[]
  onAdd: (data: EducationFormData) => Promise<void>
  onEdit: (index: number, data: EducationFormData) => Promise<void>
  onDelete: (index: number) => Promise<void>
}

const formatMonthYear = (value?: string | null) => {
  if (!value) return ''
  const normalized = value.trim().toLowerCase()
  if (normalized === 'current' || normalized === 'present') return 'Present'

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }

  return value
}

export function EducationTab({
  data,
  onAdd,
  onEdit,
  onDelete,
}: EducationTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<EducationFormData | undefined>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const handleAddClick = () => {
    setEditingIndex(null)
    setEditingData(undefined)
    setIsModalOpen(true)
  }

  const handleEditClick = (index: number, item: EducationFormData) => {
    setEditingIndex(index)
    setEditingData(item)
    setIsModalOpen(true)
  }

  const handleSave = async (formData: EducationFormData) => {
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
      <div className="flex justify-end items-center mb-2">
        <button
          onClick={handleAddClick}
          className="inline-flex items-center text-xs gap-2 px-4 py-2 bg-brand-blue text-white font-semibold rounded-input transition-all "
        >
          <Plus className="w-3 h-3" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-12 bg-brand-yellow rounded-xl border border-dashed border-slate-300">
          <Button onClick={handleAddClick} className='bg-brand-blue text-white flex items-center gap-1 text-xs'><Plus className="w-3 h-3" /> Add Education</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-brand-yellow border rounded-xl border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-sm font-semibold font-syne text-slate-900">{item.degree || '-'}</h4>
                  <p className="text-xs text-brand-blue">{item.institution_name || '-'}</p>
                </div>
                <div className="flex">
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

              <div className="flex items-center text-xs text-slate-600 mb-3">
                <span>
                  {formatMonthYear(item.start_date)}{' '}
                  -{' '}
                  {item.end_date ? formatMonthYear(item.end_date) : 'Present'}
                </span>
              </div>

              {item.details && item.details.length > 0 && (
                <ul className="text-xs text-slate-600 list-none">
                  {item.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <EducationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingData}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        message="Are you sure you want to delete this education?"
        onCancel={() => {
          setIsDeleteOpen(false)
          setDeleteIndex(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
