import * as yup from 'yup'

export const accountSettingsSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  phone: yup.string().optional(),
  linkedin_profile_url: yup
    .string()
    .transform((v) => (v === '' ? undefined : v))
    .url('Please enter a valid URL')
    .optional()
    .nullable(),
})

export type AccountSettingsFormData = yup.InferType<typeof accountSettingsSchema>
