import * as yup from 'yup'

export const certificationSchema = yup.object().shape({
  certification_name: yup
    .string()
    .nullable()
    .min(2, 'Certification name must be at least 2 characters'),
  issuing_organization: yup
    .string()
    .nullable()
    .min(2, 'Issuing organization must be at least 2 characters'),
  issue_date: yup
    .string()
    .nullable()
    .required('Issue date is required'),
  expiration_date: yup
    .string()
    .nullable(),
})

export type CertificationFormData = yup.InferType<typeof certificationSchema>
