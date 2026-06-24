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
    .required('LinkedIn profile URL is required')
    .transform((v) => {
      const trimmed = v?.trim();
      return trimmed ? trimmed : null;
    })
    .test(
      'linkedin-url',
      'Please enter a valid LinkedIn profile URL',
      (value) => {
        if (!value) return true;

        const withProtocol = /^https?:\/\//i.test(value)
          ? value
          : `https://${value}`;

        try {
          const url = new URL(withProtocol);
          return /(^|\.)linkedin\.com$/i.test(url.hostname);
        } catch {
          return false;
        }
      },
    ),
})

export type AccountSettingsFormData = yup.InferType<typeof accountSettingsSchema>
