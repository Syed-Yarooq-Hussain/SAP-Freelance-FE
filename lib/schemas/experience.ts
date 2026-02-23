import * as yup from 'yup'

export const workExperienceSchema = yup.object().shape({
  company_name: yup
    .string()
    .nullable()
    .min(2, 'Company name must be at least 2 characters'),
  position: yup
    .string()
    .nullable()
    .min(2, 'Position must be at least 2 characters'),
  start_date: yup
    .string()
    .nullable()
    .required('Start date is required'),
  end_date: yup
    .string()
    .nullable(),
  responsibilities: yup
    .array()
    .of(yup.string())
    .default([]),
})

export type WorkExperienceFormData = yup.InferType<typeof workExperienceSchema>
