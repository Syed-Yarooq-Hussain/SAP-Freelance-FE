'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, ArchiveX, BookOpenText } from 'lucide-react'
import { CertificationModal } from './certification-modal'
import { type CertificationFormData } from '@/lib/schemas/certification'
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal'

interface CertificationsTabProps {
  data: CertificationFormData[]
  onAdd: (data: CertificationFormData) => Promise<void>
  onEdit: (index: number, data: CertificationFormData) => Promise<void>
  onDelete: (index: number) => Promise<void>
}

export function CertificationsTab({
  data,
  onAdd,
  onEdit,
  onDelete,
}: CertificationsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<CertificationFormData | undefined>()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const handleAddClick = () => {
    setEditingIndex(null)
    setEditingData(undefined)
    setIsModalOpen(true)
  }

  const handleEditClick = (index: number, item: CertificationFormData) => {
    setEditingIndex(index)
    setEditingData(item)
    setIsModalOpen(true)
  }

  const handleSave = async (formData: CertificationFormData) => {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Certifications</h3>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 btn-gradient-blue text-white font-semibold rounded-input transition-all hover:shadow-lg hover:shadow-brand-blue/30"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {data.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <BookOpenText className="w-10 h-10 text-slate-300 mb-3" aria-hidden />
          <p className="text-slate-500">No certifications added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    {item.certification_name || '-'}
                  </h4>
                  <p className="text-sm text-brand-blue">{item.issuing_organization || '-'}</p>
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

              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span>
                  Issued:{' '}
                  {item.issue_date
                    ? new Date(item.issue_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })
                    : '-'}
                </span>
                {item.expiration_date && (
                  <span>
                    Expires:{' '}
                    {new Date(item.expiration_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CertificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingData}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        message="Are you sure you want to delete this certification?"
        onCancel={() => {
          setIsDeleteOpen(false)
          setDeleteIndex(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
