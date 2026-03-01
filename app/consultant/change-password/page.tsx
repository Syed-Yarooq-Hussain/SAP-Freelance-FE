'use client'

import Sidebar from '@/components/Sidebar'
import { updatePassword } from '@/services/user'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/schemas/change-password'
import { PasswordInput } from '@/components/homepage/ui/PasswordInput'
import React, { useState } from 'react'
import { useToast } from '@/providers/ToastProvider'

const ChangePasswordPage = () => {
    const {toast} = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema) as never,
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true)
    try {
      await updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      toast('Password updated successfully','success')
      reset()
    } catch (err: any) {
      toast(err?.message ?? 'Failed to update password','error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sidebar>
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-100 p-6 md:p-8">
        <div className="w-full max-w-md mx-auto text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Change Password
          </h1>
          <p className="text-slate-600 text-sm mt-4">Change your password here</p>
        </div>

        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="oldPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput
                {...field}
                label="Current password"
                placeholder="Enter your current password"
                error={errors.oldPassword?.message}
                required
                autoComplete="current-password"
              />
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput
                {...field}
                label="New password"
                placeholder="Enter new password"
                error={errors.newPassword?.message}
                required
                autoComplete="new-password"
                showStrength
              />
            )}
          />

          <Controller
            name="confirmNewPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput
                {...field}
                label="Confirm new password"
                placeholder="Confirm new password"
                error={errors.confirmNewPassword?.message}
                required
                autoComplete="new-password"
              />
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gradient-blue text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-blue/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update password'}
          </button>
          </form>
        </div>
      </div>
    </Sidebar>
  )
}

export default ChangePasswordPage
