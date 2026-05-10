'use client'

import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { parseCVViaAPI } from '@/services/common/pdfReader'
import { CircularProgress } from '@mui/material'

interface CVUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onAutofill?: (data: any) => void
}

export function CVUploadModal({
  isOpen,
  onClose,
  onAutofill,
}: CVUploadModalProps) {
  const [mounted, setMounted] = useState(false)
  const [fileNames, setFileNames] = useState<Record<string, string>>({})

  const parseCVMutation = useMutation({
    mutationFn: parseCVViaAPI,
  })

  const cvParsing = parseCVMutation.isPending
  const cvParsed = parseCVMutation.isSuccess

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const handleFileSelection = async (
    file: File,
    fieldName: string
  ) => {
    setFileNames((prev) => ({ ...prev, [fieldName]: file.name }))

    if (fieldName !== "cv") return

    parseCVMutation.mutate(file, {
      onSuccess: (parsedResponse) => {
        if (onAutofill && parsedResponse) {
          onAutofill(parsedResponse)
        }
      },
      onError: (error) => {
        console.error('CV Parsing Error:', error)
      },
    })
  }

  const handleFileDrop = async (
    e: React.DragEvent<HTMLLabelElement>,
    fieldName: string
  ) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) await handleFileSelection(file, fieldName)
  }

  const handleClose = () => {
    setFileNames({})
    parseCVMutation.reset()
    onClose()
  }

  const handleBackdropClick = () => {
    // Keep modal open after a successful parse so the message stays visible until "Close"
    if (cvParsed) return
    handleClose()
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={cvParsing}
          aria-disabled={cvParsing}
          className={`absolute right-4 top-4 p-1 rounded-full transition-colors ${
            cvParsing
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-slate-100"
          }`}
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Upload Resume to Auto-fill
        </h2>

        {/* CV Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Upload Resume
          </label>
          <div
            className={`border-2 border-dashed py-4 text-center rounded-input transition-colors ${
              cvParsed
                ? "border-green-200 bg-green-50/80 cursor-default"
                : "border-brand-blue cursor-pointer bg-[#f5faff] hover:bg-[#e6f0ff]"
            }`}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              id="cv-upload"
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              disabled={cvParsing || cvParsed}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileSelection(file, "cv")
                }
              }}
            />
            {cvParsed ? (
              <div className="px-2 text-center" role="status">
                <p className="font-semibold text-green-800">
                  CV parsed successfully
                </p>
                <p className="text-sm text-slate-600 mt-1">{fileNames["cv"]}</p>
                <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-md mx-auto">
                  Your profile has been updated using the details from your resume.
                  Close when you&apos;re finished reviewing.
                </p>
              </div>
            ) : (
              <label
                htmlFor="cv-upload"
                onDrop={(e) => handleFileDrop(e, "cv")}
                style={{ cursor: "pointer", display: "block" }}
              >
                {cvParsing ? (
                  <>
                    <p className="font-semibold text-brand-blue flex items-center justify-center gap-2">
                      Parsing your resume… please wait
                      <CircularProgress size={20} />
                    </p>
                    <p className="text-sm text-slate-600">{fileNames["cv"]}</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-brand-blue">
                      {fileNames["cv"] || "Upload Resume"}
                    </p>
                    <p className="text-sm text-slate-600">
                      Click or drag to choose a file (.pdf, .doc, .docx)
                    </p>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={cvParsing}
            className={`px-4 py-2 border border-slate-300 text-slate-900 font-semibold rounded-input transition-colors
            ${cvParsing ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`}
          >
            {cvParsed ? "Done" : "Close"}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

