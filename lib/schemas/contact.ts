import * as yup from "yup";

const SUBJECT_MAX = 78;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 300;
const PHONE_DIGITS_MIN = 10;
const PHONE_DIGITS_MAX = 15;

export const contactFormSchema = yup.object().shape({
  subject: yup
    .string()
    .required("Subject is required")
    .max(SUBJECT_MAX, `Subject must be at most ${SUBJECT_MAX} characters`),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phoneCountry: yup.string().required("Country code is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .transform((value) => (value && typeof value === "string" ? value.replace(/\D/g, "") : ""))
    .min(PHONE_DIGITS_MIN, `Phone number must be at least ${PHONE_DIGITS_MIN} digits`)
    .max(PHONE_DIGITS_MAX, `Phone number must be at most ${PHONE_DIGITS_MAX} digits`)
    .matches(/^\d+$/, "Phone number must contain only numbers"),
  message: yup
    .string()
    .required("Message is required")
    .min(MESSAGE_MIN, `Message must be at least ${MESSAGE_MIN} characters`)
    .max(MESSAGE_MAX, `Message must be at most ${MESSAGE_MAX} characters`),
});

export type ContactFormData = yup.InferType<typeof contactFormSchema>;

export { SUBJECT_MAX, MESSAGE_MIN, MESSAGE_MAX, PHONE_DIGITS_MIN, PHONE_DIGITS_MAX };
