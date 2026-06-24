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

const PROFESSIONAL_HEADLINE_MAX_LENGTH = 100

function getPlainTextLength(value?: string | null) {
  return (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length
}

// Combined Profile Edit Schema
export const profileEditSchema = yup.object().shape({
  expertise_level: yup.string().nullable(),
  core: yup
    .array()
    .of(yup.string())
    .min(1, 'Select at least one core module')
    .max(2, 'You can select maximum 2 items')
    .required('Select at least one core module')
    .default([]),
  others: yup.array().of(yup.string()).default([]),
  linkedin_url: yup.string().nullable(),
  professional_headline: yup
    .string()
    .nullable()
    .test(
      'professional-headline-max',
      `Professional Headline cannot exceed ${PROFESSIONAL_HEADLINE_MAX_LENGTH} characters`,
      (value) => getPlainTextLength(value) <= PROFESSIONAL_HEADLINE_MAX_LENGTH
    ),
  industries: yup.string().nullable(),
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
    .nullable(),
  country: yup.string().nullable(),
  // Professional Summary - from clients_summary
  clients_summary: yup
    .string()
    .nullable()
    .test(
      'professional-headline-max',
      `Professional Headline cannot exceed ${PROFESSIONAL_HEADLINE_MAX_LENGTH} characters`,
      (value) => getPlainTextLength(value) <= PROFESSIONAL_HEADLINE_MAX_LENGTH
    ),

  // Experience & Rate - from freelancer profile
  experience: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue == null) return null
      const parsed = Number(originalValue)
      return Number.isNaN(parsed) ? null : parsed
    })
    .typeError('Experience must be a number')
    .min(0, 'Experience cannot be negative'),
  rate: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue == null ? null : value
    )
    .typeError('Rate must be a number')
    .min(0, 'Rate cannot be negative'),
  weekly_available_hours: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue == null) return null
      const parsed = Number(originalValue)
      return Number.isNaN(parsed) ? null : parsed
    })
    .required('Weekly availability is required')
    .typeError('Hours must be a number')
    .min(5, 'Minimum 5 hours required')
    .max(60, 'Weekly hours cannot exceed 60'),
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
    .default([])
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
  linkedin_url: string | null | undefined
  username: string
  email: string
  phone: string | null | undefined
  city: string | null | undefined
  country: string | null | undefined
  clients_summary: string | null | undefined
  experience: number | null | undefined
  rate: number | null | undefined
  expertise_level: string | null | undefined
  professional_headline: string | null | undefined;
  industries: string | null | undefined;
  core: string[]
  others: string[]
  weekly_available_hours: number | null | undefined
  cv_url: string | null | undefined
  work_experiences: WorkExperienceFormData[]
  certifications: CertificationFormData[]
  educations: EducationFormData[]
  projects: ProjectFormData[]  
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isNaN(n) ? null : n
}

function parseModuleValue(raw: unknown): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map((m) => String(m)).filter(Boolean)
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map((m) => String(m)).filter(Boolean)
    } catch {
      return raw
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean)
    }
  }
  return []
}

export function buildProfileEditDefaults(consultant: unknown): ProfileEditFormData {
  const c = consultant as Record<string, unknown> | null | undefined
  const u = (c?.user as Record<string, unknown> | undefined) ?? {}
  const userModules = Array.isArray(u?.modules)
    ? (u.modules as Array<Record<string, unknown>>)
    : []
  const coreFromUserModules = userModules
    .filter((m) => Boolean(m?.is_primary))
    .map((m) => String((m?.module as Record<string, unknown> | undefined)?.id ?? ''))
    .filter(Boolean)
  const othersFromUserModules = userModules
    .filter((m) => !(m?.is_primary))
    .map((m) => String((m?.module as Record<string, unknown> | undefined)?.id ?? ''))
    .filter(Boolean)
  const fallbackCore = parseModuleValue(c?.core_module)
  const fallbackOthers = parseModuleValue(c?.other_module)

  return {
    linkedin_url: u.linkedin_url != null ? String(u.linkedin_url) : '',
    username: String(u.username ?? ''),
    email: String(u.email ?? ''),
    phone: u.phone != null ? String(u.phone) : '',
    city: u.city != null ? String(u.city) : '',
    country: u.country != null ? String(u.country) : '',
    clients_summary: c?.clients_summary != null ? String(c.clients_summary) : '',
    experience: toNullableNumber(c?.experience),
    rate: toNullableNumber(c?.rate),
    expertise_level: c?.expertise_level != null ? String(c.expertise_level) : '',
    professional_headline: c?.professional_headline != null ? String(c.professional_headline) : '',
    industries: c?.industries != null ? String(c.industries) : '',
    core: coreFromUserModules.length > 0 ? coreFromUserModules : fallbackCore,
    others: othersFromUserModules.length > 0 ? othersFromUserModules : fallbackOthers,
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
  }
}
