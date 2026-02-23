'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { WorkExperienceModal } from './work-experience-modal'
import { type WorkExperienceFormData } from '@/lib/schemas/experience'

interface WorkExperienceTabProps {
  data: WorkExperienceFormData[]
  onAdd: (data: WorkExperienceFormData) => Promise<void>
  onEdit: (index: number, data: WorkExperienceFormData) => Promise<void>
  onDelete: (index: number) => Promise<void>
}

export function WorkExperienceTab({
  data,
  onAdd,
  onEdit,
  onDelete,
}: WorkExperienceTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<WorkExperienceFormData | undefined>()

  const handleAddClick = () => {
    setEditingIndex(null)
    setEditingData(undefined)
    setIsModalOpen(true)
  }

  const handleEditClick = (index: number, item: WorkExperienceFormData) => {
    setEditingIndex(index)
    setEditingData(item)
    setIsModalOpen(true)
  }

  const handleSave = async (formData: WorkExperienceFormData) => {
    if (editingIndex !== null) {
      await onEdit(editingIndex, formData)
    } else {
      await onAdd(formData)
    }
  }

  const handleDelete = async (index: number) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      await onDelete(index)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Work Experience</h3>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 btn-gradient-blue text-white font-semibold rounded-input transition-all hover:shadow-lg hover:shadow-brand-blue/30"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-slate-500">No work experience added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{item.position || '-'}</h4>
                  <p className="text-sm text-brand-blue">{item.company_name || '-'}</p>
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

              <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                <span>
                  {item.start_date
                    ? (() => {
                        const startDate = new Date(item.start_date)
                        return isNaN(startDate.getTime())
                          ? ''
                          : startDate.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })
                      })()
                    : ''}{' '}
                  -{' '}
                  {item.end_date
                    ? (() => {
                        const endDate = new Date(item.end_date)
                        return isNaN(endDate.getTime())
                          ? 'Present'
                          : endDate.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })
                      })()
                    : 'Present'}
                </span>
              </div>

              {item.responsibilities && item.responsibilities.length > 0 && (
                <ul className="text-sm text-slate-600 list-disc list-inside">
                  {item.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <WorkExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingData}
      />
    </div>
  )
}
