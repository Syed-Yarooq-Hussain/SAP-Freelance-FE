import * as yup from 'yup'

export const createChangePasswordSchema = (requireCurrentPassword = true) =>
  yup.object().shape({
    oldPassword: requireCurrentPassword
      ? yup.string().required('Current password is required')
      : yup.string().optional(),
    newPassword: yup
      .string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmNewPassword: yup
      .string()
      .required('Please confirm your new password')
      .oneOf([yup.ref('newPassword')], 'Passwords must match'),
  })

export const changePasswordSchema = createChangePasswordSchema(true)

export type ChangePasswordFormData = yup.InferType<
  ReturnType<typeof createChangePasswordSchema>
>
