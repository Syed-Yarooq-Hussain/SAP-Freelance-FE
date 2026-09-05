export type CreateClientFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type CreateClientFormErrors = Partial<
  Record<keyof CreateClientFormValues, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateCreateClientForm = (
  values: CreateClientFormValues
): CreateClientFormErrors => {
  const errors: CreateClientFormErrors = {};
  const email = values.email.trim();

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";

  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 8)
    errors.password = "Password must contain at least 8 characters.";

  if (!values.confirmPassword)
    errors.confirmPassword = "Please confirm the password.";
  else if (values.password !== values.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
};

export const parseProfitMargin = (
  value: string
): { value?: number; error?: string } => {
  if (value.trim() === "") return { error: "Profit margin is required." };
  if (!/^\d+$/.test(value.trim()))
    return { error: "Enter a non-negative whole number." };

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0)
    return { error: "Enter a non-negative whole number." };

  return { value: parsed };
};
