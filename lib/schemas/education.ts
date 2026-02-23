import * as yup from 'yup'

export const educationSchema = yup.object().shape({
  institution_name: yup
    .string()
    .nullable()
    .min(2, 'Institution name must be at least 2 characters'),
  degree: yup
    .string()
    .nullable()
    .min(2, 'Degree must be at least 2 characters'),
  start_date: yup
    .string()
    .nullable()
    .required('Start date is required'),
  end_date: yup
    .string()
    .nullable(),
  details: yup
    .array()
    .of(yup.string())
    .default([]),
})

export type EducationFormData = yup.InferType<typeof educationSchema>
