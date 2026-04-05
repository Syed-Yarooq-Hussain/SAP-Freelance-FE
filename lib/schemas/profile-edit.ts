import * as yup from 'yup'

// Work Experience Schema
const workExperienceSchema = yup.object().shape({
  id: yup.string().optional(),
  company_name: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Company name is required'),
      otherwise: (schema) => schema.min(2, 'Company name must be at least 2 characters'),
    }),
  position: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Position is required'),
      otherwise: (schema) => schema.min(2, 'Position must be at least 2 characters'),
    }),
  start_date: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Start date is required'),
    }),
  end_date: yup.string().nullable(),
  responsibilities: yup.array().of(yup.string()).default([]),
})

// Education Schema
const educationSchema = yup.object().shape({
  id: yup.string().optional(),
  institution_name: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Institution name is required'),
      otherwise: (schema) => schema.min(2, 'Institution name must be at least 2 characters'),
    }),
  degree: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Degree is required'),
      otherwise: (schema) => schema.min(2, 'Degree must be at least 2 characters'),
    }),
  start_date: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Start date is required'),
    }),
  end_date: yup.string().nullable(),
  details: yup.array().of(yup.string()).default([]),
})

// Certification Schema
const certificationSchema = yup.object().shape({
  id: yup.string().optional(),
  certification_name: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Certification name is required'),
      otherwise: (schema) => schema.min(2, 'Certification name must be at least 2 characters'),
    }),
  issuing_organization: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Issuing organization is required'),
      otherwise: (schema) => schema.min(2, 'Issuing organization must be at least 2 characters'),
    }),
  issue_date: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Issue date is required'),
    }),
  expiration_date: yup.string().nullable(),
})

// Project Schema
const projectSchema = yup.object().shape({
  id: yup.string().optional(),
  project_name: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) =>
        schema
          .required('Project name is required')
          .min(2, 'Project name must be at least 2 characters'),
      otherwise: (schema) => schema.min(2, 'Project name must be at least 2 characters'),
    }),
  client_name: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) =>
        schema
          .required('Client name is required')
          .min(2, 'Client name must be at least 2 characters'),
      otherwise: (schema) => schema.min(2, 'Client name must be at least 2 characters'),
    }),
  project_summary: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) =>
        schema
          .required('Project summary is required')
          .min(10, 'Project summary must be at least 10 characters'),
      otherwise: (schema) => schema.min(10, 'Project summary must be at least 10 characters'),
    }),
  start_date: yup
    .string()
    .nullable()
    .when('$existingItem', {
      is: true,
      then: (schema) => schema.required('Start date is required'),
    }),
  end_date: yup.string().nullable(),
  budget: yup
    .number()
    .nullable()
    .typeError('Budget must be a number'),
  status: yup.string().nullable().oneOf(['Active', 'Completed', 'Paused']),
})

// Combined Profile Edit Schema
export const profileEditSchema = yup.object().shape({
  // Basic Information - from user object
  username: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .nullable()
    .test(
      'phone-format',
      'Invalid phone number',
      (value) =>
        value == null ||
        String(value).trim() === '' ||
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(String(value))
    ),

  // Key Locations - from user object
  city: yup
    .string()
    .nullable()
    .min(2, 'City must be at least 2 characters'),
  country: yup.string().nullable(),

  // Professional Summary - from clients_summary
  clients_summary: yup
    .string()
    .nullable()
    .max(2000, 'Professional summary cannot exceed 2000 characters'),

  // Experience & Rate - from freelancer profile
  experience: yup
    .number()
    .nullable()
    .typeError('Experience must be a number')
    .min(0, 'Experience cannot be negative'),
  rate: yup
    .number()
    .nullable()
    .typeError('Rate must be a number')
    .min(0, 'Rate cannot be negative'),
  weekly_available_hours: yup
    .number()
    .nullable()
    .typeError('Hours must be a number')
    .min(0, 'Hours cannot be negative'),
  cv_url: yup.string().nullable(),

  // Arrays with conditional requirements
  work_experiences: yup
    .array()
    .of(workExperienceSchema)
    .default([]),

  certifications: yup
    .array()
    .of(certificationSchema)
    .default([]),

  educations: yup
    .array()
    .of(educationSchema)
    .default([]),

  projects: yup
    .array()
    .of(projectSchema)
    .default([]),
  
  skills: yup.array().of(yup.string()).default([]),
})

export type WorkExperienceFormData = yup.InferType<typeof workExperienceSchema>
export type EducationFormData = yup.InferType<typeof educationSchema>
export type CertificationFormData = yup.InferType<typeof certificationSchema>
export type ProjectFormData = yup.InferType<typeof projectSchema>

/**
 * Explicit form shape for react-hook-form + yupResolver (yup.InferType marks some keys optional,
 * which does not match Resolver's expected FieldValues).
 */
export type ProfileEditFormData = {
  username: string
  email: string
  phone: string | null | undefined
  city: string | null | undefined
  country: string | null | undefined
  clients_summary: string | null | undefined
  experience: number | null | undefined
  rate: number | null | undefined
  weekly_available_hours: number | null | undefined
  cv_url: string | null | undefined
  work_experiences: WorkExperienceFormData[]
  certifications: CertificationFormData[]
  educations: EducationFormData[]
  projects: ProjectFormData[]
  skills: string[]
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isNaN(n) ? null : n
}

export function buildProfileEditDefaults(consultant: unknown): ProfileEditFormData {
  const c = consultant as Record<string, unknown> | null | undefined
  const u = (c?.user as Record<string, unknown> | undefined) ?? {}

  return {
    username: String(u.username ?? ''),
    email: String(u.email ?? ''),
    phone: u.phone != null ? String(u.phone) : '',
    city: u.city != null ? String(u.city) : '',
    country: u.country != null ? String(u.country) : '',
    clients_summary: c?.clients_summary != null ? String(c.clients_summary) : '',
    experience: toNullableNumber(c?.experience),
    rate: toNullableNumber(c?.rate),
    weekly_available_hours: toNullableNumber(c?.weekly_available_hours),
    cv_url: c?.cv_url != null ? String(c.cv_url) : '',
    work_experiences: Array.isArray(c?.work_experiences) ? (c.work_experiences as WorkExperienceFormData[]) : [],
    certifications: Array.isArray(c?.certification)
      ? (c.certification as CertificationFormData[])
      : Array.isArray(c?.certifications)
        ? (c.certifications as CertificationFormData[])
        : [],
    educations: Array.isArray(c?.education) ? (c.education as EducationFormData[]) : [],
    projects: Array.isArray(c?.projects) ? (c.projects as ProjectFormData[]) : [],
    skills: Array.isArray(c?.skills) ? (c.skills as string[]).filter((s): s is string => typeof s === 'string') : [],
  }
}
