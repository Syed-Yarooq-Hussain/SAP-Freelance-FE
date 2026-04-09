import * as yup from 'yup'

export const projectSchema = yup.object().shape({
  project_name: yup
    .string()
    .required('Project name is required')
    .min(2, 'Project name must be at least 2 characters'),
  client_name: yup
    .string()
    .required('Client name is required')
    .min(2, 'Client name must be at least 2 characters'),
  project_summary: yup
    .string()
    .required('Project summary is required')
    .min(10, 'Project summary must be at least 10 characters'),
  start_date: yup
    .date()
    .required('Start date is required')
    .typeError('Start date must be a valid date'),
  end_date: yup
    .date()
    .nullable()
    .typeError('End date must be a valid date'),
  budget: yup
    .number()
    .nullable()
    .typeError('Budget must be a valid number'),
  technologies: yup
    .array()
    .of(yup.string())
    .nullable(),
  status: yup
    .string()
    .oneOf(['active', 'completed', 'paused'], 'Invalid status'),
})

export type ProjectFormData = yup.InferType<typeof projectSchema>
