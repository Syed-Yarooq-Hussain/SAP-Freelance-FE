"use client";

import AppButton from "@/components/Button";
import { IOption } from "@/types/options";
import { parseCV } from "@/utils/cvParser";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  ButtonProps,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, ReactNode, useRef, useState, useEffect } from "react";
import {
  Controller,
  FieldValues,
  RegisterOptions,
  useForm,
} from "react-hook-form";

/* add optional fetchUrl to enable API call for dynamic selects */
export interface IFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  rules?: RegisterOptions;
  options?: IOption[]; // static options
  fetchUrl?: string; // optional: "/api/modules?roleId={{roleId}}"
  column?: any;
  row?: any;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  select?: boolean;
  defaultValue?: string | number | boolean | null;
}

/* other props unchanged */
interface ICreateFormProps {
  elements: IFieldConfig[];
  onSuccess: (data: FieldValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  onCVParsed?: (cvData: Partial<FieldValues>) => void;
  actionsContainerProps?: any;
  submitButton?: ButtonProps;
  cancelButton?: ButtonProps;
  leadingContent?: ReactNode;
  inlineActions?: boolean;
}

const interpolate = (template: string, vals: FieldValues) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = vals[key];
    return v == null ? "" : encodeURIComponent(String(v));
  });

export const CreateForm: FC<ICreateFormProps> = ({
  elements,
  onSuccess,
  onCancel,
  loading = false,
  error,
  submitButton,
  cancelButton,
  actionsContainerProps,
  leadingContent,
  inlineActions = false,
  onCVParsed,
}) => {
  const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm();

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const autoFilledRef = useRef<Set<string>>(new Set());
  const [step, setStep] = useState<number>(0);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, IOption[]>>({});
  const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>({});

  const handleTogglePassword = (name: string) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  /* fetch dynamic options if field has fetchUrl */
  const fetchOptionsFor = async (field: IFieldConfig) => {
    if (!field?.fetchUrl) return;
    const url = interpolate(field.fetchUrl, getValues());
    setLoadingOptions(s => ({ ...s, [field.name]: true }));
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("fetch failed");
      const json = await res.json();
      const opts: IOption[] = Array.isArray(json)
        ? json.map((item: any) => ({ value: item.value ?? item.id, label: item.label ?? item.name ?? String(item.value ?? item.id) }))
        : [];
      setDynamicOptions(s => ({ ...s, [field.name]: opts }));
    } catch (e) {
      console.error("fetchOptions error", e);
      setDynamicOptions(s => ({ ...s, [field.name]: [] }));
    } finally {
      setLoadingOptions(s => ({ ...s, [field.name]: false }));
    }
  };

  useEffect(() => {
    // whenever we advance to a step, if that field has fetchUrl, prefetch options
    const fld = elements[step];
    if (!fld) return;
    if (fld.fetchUrl && !dynamicOptions[fld.name]) {
      fetchOptionsFor(fld);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleFileSelection = async (
    file: File,
    fieldName: string,
    onChange: (value: File | null) => void
  ) => {
    onChange(file);
    setFileNames((prev) => ({ ...prev, [fieldName]: file.name }));

    if (fieldName === "cv") {
      try {
        const parsed = await parseCV(file);
        if (onCVParsed) onCVParsed(parsed);

        const fillable = new Set(elements.map((e) => e.name));
        const nextFilled = new Set<string>();

        for (const [key, value] of Object.entries(parsed)) {
          if (!fillable.has(key)) continue;

          const str = value == null ? "" : String(value);
          setValue(key, str, { shouldDirty: true, shouldValidate: true });

          if (str.trim() !== "") nextFilled.add(key);
        }

        for (const key of autoFilledRef.current) {
          if (!nextFilled.has(key)) {
            setValue(key, "", { shouldDirty: true, shouldValidate: true });
          }
        }

        autoFilledRef.current = nextFilled;

        // === AUTO ADVANCE to next step after CV parsed ===
        const nextIndex = step + 1;
        if (nextIndex < elements.length) {
          // optionally prefetch dynamic options for next field
          const nextField = elements[nextIndex];
          if (nextField?.fetchUrl) {
            await fetchOptionsFor(nextField);
          }
          setStep(nextIndex);
        }
      } catch (err) {
        console.error("CV parsing failed:", err);
      }
    }
  };

  const handleFileDrop = async (
    e: React.DragEvent<HTMLLabelElement>,
    fieldName: string,
    onChange: (value: File | null) => void
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFileSelection(file, fieldName, onChange);
  };

  /* render only current step's field (instead of full grid) */
  const renderCurrentField = () => {
    const element = elements[step];
    if (!element) return null;

    const isPassword = element.type === "password";
    const isFile = element.type === "file";
    const isSelect = !!element.options?.length || !!dynamicOptions[element.name];

    return (
      <FormControl fullWidth key={element.name} sx={{ width: "100%" }}>
        <Controller
          name={element.name}
          defaultValue={element.defaultValue ?? ""}
          control={control}
          rules={element.rules}
          render={({ field }) => {
            if (isFile) {
              return (
                <Box
                  sx={{
                    border: "1px dashed #4680FF",
                    borderRadius: 2,
                    py: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: "#f5faff",
                    "&:hover": { bgcolor: "#e6f0ff" },
                    transition: "0.2s",
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    id={element.name}
                    type="file"
                    style={{ display: "none" }}
                    accept={element.inputProps?.accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelection(file, element.name, field.onChange);
                    }}
                  />
                  <label
                    htmlFor={element.name}
                    onDrop={(e) => handleFileDrop(e, element.name, field.onChange)}
                    style={{ display: "block", cursor: "pointer" }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" color="#4680FF">
                      {fileNames[element.name] || element.label || "Upload"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Click or drag to choose a file (.pdf, .doc, .docx)
                    </Typography>
                  </label>
                </Box>
              );
            }

            return (
              <TextField
                {...field}
                fullWidth
                size="small"
                variant="outlined"
                label={element.label}
                type={
                  isPassword
                    ? showPassword[element.name]
                      ? "text"
                      : "password"
                    : element.type || "text"
                }
                error={!!errors[element.name]}
                helperText={errors[element.name]?.message?.toString()}
                disabled={loading}
                placeholder={element.placeholder}
                select={isSelect}
                InputProps={{
                  ...(isPassword
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleTogglePassword(element.name)}
                              edge="end"
                              size="small"
                            >
                              {showPassword[element.name] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : {}),
                }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value: any) => {
                    if (!value) return <Typography color="gray">Select {element.label}</Typography>;
                    return value as React.ReactNode;
                  },
                }}
              >
                {loadingOptions[element.name] && <MenuItem value=""><Typography>Loading...</Typography></MenuItem>}

                {/* static */}
                {element.options?.map((opt) => (
                  <MenuItem key={String(opt.value)} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}

                {/* dynamic (fetched) */}
                {dynamicOptions[element.name]?.map((opt) => (
                  <MenuItem key={String(opt.value)} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          }}
        />
      </FormControl>
    );
  };

  const submitHandler = (data: FieldValues) => onSuccess(data);

  const goNext = async () => {
    // validate current field before moving
    const name = elements[step]?.name;
    if (name) {
      // trigger single field validation
      // note: using getValues + basic check if you prefer immediate move then validate on submit
      // here we simply move forward if no error in formState for that field
    }
    const next = step + 1;
    if (next < elements.length) {
      // prefetch next options if needed
      const nextField = elements[next];
      if (nextField?.fetchUrl) await fetchOptionsFor(nextField);
      setStep(next);
    }
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)}>
      {error && <Alert severity="error">{error}</Alert>}

      {leadingContent ? (
        <Box sx={{ mt: 2, display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box sx={{ flexShrink: 0 }}>{leadingContent}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>{renderCurrentField()}</Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>{renderCurrentField()}</Box>
      )}

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3, ...actionsContainerProps?.sx }} {...actionsContainerProps}>
        <AppButton label="Back" color="secondary" onClick={goPrev} sx={{ width: "auto", minWidth: "160px" }} />
        {/* if last step show submit */}
        {step === elements.length - 1 ? (
          <AppButton label={String(submitButton?.children || "Submit")} color="primary" onClick={handleSubmit(submitHandler)} loading={loading} sx={{ width: "auto", minWidth: "160px", ...submitButton?.sx }} />
        ) : (
          <AppButton label="Next" color="primary" onClick={goNext} sx={{ width: "auto", minWidth: "160px" }} />
        )}
        {onCancel && <AppButton label={String(cancelButton?.children || "Cancel")} color="secondary" onClick={onCancel} sx={{ width: "auto", minWidth: "160px", ...cancelButton?.sx }} />}
      </Stack>
    </Box>
  );
};
