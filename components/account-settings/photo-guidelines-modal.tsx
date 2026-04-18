'use client'

import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

interface PhotoGuidelinesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PhotoGuidelinesModal({
  isOpen,
  onClose,
}: PhotoGuidelinesModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const guidelines = [
    'Choose a Plain Background',
    'Face the Camera',
    'Wear Professional Attire',
    'Center your photo around your head and shoulders to ensure clients can easily see your face',
    "Keep your photo natural. Avoid heavy filters or edits to maintain authenticity.",
  ]

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] px-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Photo Guidelines
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="space-y-3">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center mt-1">
                <span className="text-white text-sm font-semibold">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed pt-1">
                {guideline}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="bg-brand-blue w-full text-white font-semibold py-3 rounded-input mt-7 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
