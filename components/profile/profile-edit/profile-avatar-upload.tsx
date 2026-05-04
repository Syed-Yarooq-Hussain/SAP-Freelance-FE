'use client'

import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { useAppSelector } from '@/lib/store/hook'
import { request } from '@/utils/request'
import { getConsultantMeService } from '@/services/getConsultantProfile'
import { updateUser } from '@/lib/store/features/user/userSlice'
import { Camera, Trash, Upload, X } from 'lucide-react'
import { updateConsultantProfile } from '@/services/consultants'
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal'

export function ProfileAvatarUpload() {
  const dispatch = useDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Get user data from Redux
  const { user } = useAppSelector((state) => state.user)
  const avatarUrl = user?.user?.avatar

  const sanitizeUrl = (url: string): string => {
    if (!url) return ''
    return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WebP image')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const result:any = await request<FormData, { url: string }>({
        url: `/consultants/upload-profile/${user?.user?.id}`,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const url = sanitizeUrl(result?.data?.url)
      if (url) {
        const consultantData = await getConsultantMeService()

        if (consultantData?.data) {
          dispatch(updateUser({ user: consultantData.data }))
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClearImage = async () => {
    setLoading(true)
    try {
      // Send request to clear avatar on backend
      await updateConsultantProfile(user?.user?.id, {user: {avatar: ''}} as any)

      // Fetch updated user data
      const consultantData = await getConsultantMeService()

      if (consultantData?.data) {
        dispatch(updateUser({ user: consultantData.data }))
      }
    } catch (error) {
      console.error('Error clearing image:', error)
      alert('Failed to remove image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex md:flex-col flex-row items-center md:gap-4 gap-0 md:p-6 p-0 bg-background-main rounded-box border border-slate-200">
        {/* Profile Image */}
        <div className="relative w-32 h-32 md:block flex justify-center items-center">
          {avatarUrl ? (
            <Image
              src={sanitizeUrl(avatarUrl)}
              alt="Profile avatar"
              width={128}
              height={128}
              className="md:w-full md:h-full w-24 h-24 rounded-3xl object-cover"
            />
          ) : (
            <div className="md:w-full md:h-full w-24 h-24 rounded-3xl shadow-xl bg-brand-blue flex flex-col items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* File info text */}
        <div className='flex flex-col gap-2 md:justify-center md:items-center justify-start items-start'>
          <p className="md:hidden block text-base font-semibold">Profile Photo</p>
          <p className="text-xs text-start md:text-center text-light-grey md:mt-1 mt-0.5">
            <span className='md:block hidden'>JPG, PNG or WebP. Max 5 MB. Square image recommended.</span>
            <span className='md:hidden block'>JPG, PNG · max 5 MB · square</span>
          </p>

          {/* Upload input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
            disabled={loading}
          />

          {/* Upload button */}
          <div className='flex flex-row md:flex-col gap-2'>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full text-xs md:text-sm px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className='md:block hidden'>{loading ? 'Uploading...' : 'Upload Photo'}</span>
              <span className='md:hidden block'>Upload</span>
            </button>

            {/* Clear button - only show if image exists */}
            {avatarUrl && (
              <button
                onClick={() => setConfirmOpen(true)}
                disabled={loading}
                className="w-full text-sm px-4 py-2 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash className="w-4 h-4 md:block hidden" />
                Remove
              </button>
            )}

          </div>
        </div>

      </div>
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        title="Remove profile picture"
        message="Are you sure you want to remove your profile picture?"
        confirmLabel="Remove"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          void handleClearImage()
        }}
      />
    </>
  )
}
