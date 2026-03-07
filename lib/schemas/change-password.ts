import * as yup from 'yup'

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
})

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>
