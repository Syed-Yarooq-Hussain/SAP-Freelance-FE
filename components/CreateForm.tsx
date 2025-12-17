"use client";

import { useSapModules } from "@/actions/common/useSapModules";
import AppButton from "@/components/Button";
import { ICreateFormProps } from "@/types/create-form";
import { IOption } from "@/types/options";
import { parseCV } from "@/utils/cvParser";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useRef, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import FormProgress from "./FormProgress";

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
  onCVParsed,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const autoFilledRef = useRef<Set<string>>(new Set());
  const [step, setStep] = useState<number>(0);
  const { data, isLoading, isError } = useSapModules();
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, IOption[]>
  >({});

  const handleTogglePassword = (name: string) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    if (!data?.data) return;

    setDynamicOptions({
      coreModule: data.data.core.map((item) => ({
        value: item.id,
        label: item.name,
      })),
      otherModule: data.data.others.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    });
  }, [data]);

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

        const nextIndex = step + 1;
        if (nextIndex < elements.length) {
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

  const renderCurrentField = () => {
    const element = elements[step];
    if (!element) return null;

    const isPassword = element.type === "password";
    const isFile = element.type === "file";
    const isSelect =
      !!element.options?.length || !!dynamicOptions[element.name]?.length;

    if (element.hidden) {
      return (
        <Controller
          key={element.name}
          name={element.name}
          defaultValue={element.defaultValue ?? ""}
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />
      );
    }

    return (
      <FormControl fullWidth sx={{ width: "100%" }}>
        <Controller
          key={element.name}
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
                      if (file)
                        handleFileSelection(file, element.name, field.onChange);
                    }}
                  />
                  <label
                    htmlFor={element.name}
                    onDrop={(e) =>
                      handleFileDrop(e, element.name, field.onChange)
                    }
                    style={{ display: "block", cursor: "pointer" }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="#4680FF"
                    >
                      {fileNames[element.name] || element.label || "Upload"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
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
                placeholder={element.placeholder}
                disabled={loading || isLoading}
                select={isSelect}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  htmlInput: element.inputProps,
                  input: isPassword
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleTogglePassword(element.name)}
                              edge="end"
                              size="small"
                            >
                              {showPassword[element.name] ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : undefined,

                  select: isSelect
                    ? {
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (!value) {
                            return (
                              <Typography color="gray">
                                Select {element.label}
                              </Typography>
                            );
                          }

                          const option =
                            element.options?.find((o) => o.value === value) ||
                            dynamicOptions[element.name]?.find(
                              (o) => o.value === value
                            );

                          return option?.label ?? String(value);
                        },
                      }
                    : undefined,
                }}
              >
                <MenuItem value="">
                  <em>{element.placeholder ?? `Select ${element.label}`}</em>
                </MenuItem>

                {element.options?.map((opt) => (
                  <MenuItem key={String(opt.value)} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}

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

  const submitHandler = async (data: FieldValues) => {
    const valid = await trigger();
    if (!valid) return;

    onSuccess(data);
  };

  const goNext = async () => {
    const currentField = elements[step];
    if (!currentField) return;

    const valid = await trigger(currentField.name);
    if (!valid) return;

    const next = step + 1;
    if (next < elements.length) {
      setStep(next);
    }
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)}>
      <FormProgress currentStep={step} totalSteps={elements.length} />

      {error && <Alert severity="error">{error}</Alert>}

      {leadingContent ? (
        <Box sx={{ mt: 2, display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box sx={{ flexShrink: 0 }}>{leadingContent}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>{renderCurrentField()}</Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>{renderCurrentField()}</Box>
      )}

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mt: 3, ...actionsContainerProps?.sx }}
        {...actionsContainerProps}
      >
        {step > 0 && (
          <AppButton
            label="Back"
            color="secondary"
            onClick={goPrev}
            sx={{ minWidth: "160px" }}
          />
        )}

        {step === elements.length - 1 ? (
          <AppButton
            label={String(submitButton?.children || "Submit")}
            color="primary"
            onClick={handleSubmit(submitHandler)}
            loading={loading}
            sx={{ minWidth: "160px", ...submitButton?.sx }}
          />
        ) : (
          <AppButton
            label="Next"
            color="primary"
            onClick={goNext}
            sx={{ minWidth: "160px" }}
          />
        )}

        {onCancel && (
          <AppButton
            label={String(cancelButton?.children || "Cancel")}
            color="secondary"
            onClick={onCancel}
            sx={{ minWidth: "160px", ...cancelButton?.sx }}
          />
        )}
      </Stack>
    </Box>
  );
};
