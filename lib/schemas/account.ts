import * as yup from 'yup'

export const accountSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
    clients_summary: yup
    .string()
    .optional(),
  core: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Select at least one core module')
    .required('Core modules are required'),
  others: yup
    .array()
    .of(yup.string().required())
    .optional(),
  // working_schedule: yup
  //   .object()
  //   .shape({
  //     weekly: yup.array().of(
  //       yup.object().shape({
  //         day: yup.string().required(),
  //         slot: yup.array().of(
  //           yup.object().shape({
  //             start: yup.string(),
  //             end: yup.string(),
  //           })
  //         ).optional(),
  //         active: yup.boolean(),
  //       })
  //     ),
  //     custom: yup.array().optional(),
  //   })
  //   .optional(),
    weekly_available_hours: yup
    .number()
    .typeError('Weekly hours must be a number')
    .min(1, 'Weekly hours must be at least 1')
    .max(168, 'Weekly hours cannot exceed 168')
    .required('Weekly hours is required'),
    rate: yup
    .number()
    .typeError('Rate must be a number')
    .min(1, 'Rate must be at least $1')
    .max(999999, 'Rate is too high')
    .required('Rate is required'),
    experience: yup
    .number()
    .typeError('Experience must be a number')
    .min(0, 'Experience cannot be negative')
    .max(100, 'Experience is unrealistic')
    .required('Experience is required'),
    city: yup
    .string()
    .required('City is required'),
    country: yup
    .string()
    .required('Country is required'),
  profileImage: yup
    .string()
    .optional(),
})

export type AccountFormData = yup.InferType<typeof accountSchema>
