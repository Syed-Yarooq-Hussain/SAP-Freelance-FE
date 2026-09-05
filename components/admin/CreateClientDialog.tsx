"use client";

import { useCreateAdminClient } from "@/actions/admin/useAdminClientManagement";
import { useToast } from "@/providers/ToastProvider";
import {
  validateCreateClientForm,
  type CreateClientFormErrors,
  type CreateClientFormValues,
} from "@/utils/adminClientValidation";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type CreateClientDialogProps = {
  open: boolean;
  onClose: () => void;
};

const INITIAL_VALUES: CreateClientFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function CreateClientDialog({
  open,
  onClose,
}: CreateClientDialogProps) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<CreateClientFormErrors>({});
  const [serverError, setServerError] = useState("");
  const createClient = useCreateAdminClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setValues(INITIAL_VALUES);
      setErrors({});
      setServerError("");
      createClient.reset();
    }
  }, [open]);

  const updateField = (field: keyof CreateClientFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError("");
  };

  const submit = () => {
    const validationErrors = validateCreateClientForm(values);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    createClient.mutate(
      { email: values.email.trim(), password: values.password },
      {
        onSuccess: () => {
          toast("Verified client created successfully.", "success");
          onClose();
        },
        onError: (error) => setServerError(error.message),
      }
    );
  };

  return (
    <Dialog open={open} onClose={createClient.isPending ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 750 }}>Create verified client</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          The account will be active and email-verified immediately.
        </Typography>
        <Stack spacing={2}>
          {serverError ? <Alert severity="error">{serverError}</Alert> : null}
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={createClient.isPending}
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(event) => updateField("password", event.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password ?? "Minimum 8 characters"}
            disabled={createClient.isPending}
          />
          <TextField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            disabled={createClient.isPending}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={createClient.isPending}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={createClient.isPending}>
          {createClient.isPending ? "Creating..." : "Create Client"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
