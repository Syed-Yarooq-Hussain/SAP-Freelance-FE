"use client";

import { useSapModules } from "@/actions/common/useSapModules";
import AppButton from "@/components/Button";
import { parseCVViaAPI } from "@/services/common/pdfReader";
import { ICreateFormProps, IFieldConfig } from "@/types/create-form";
import { IOption } from "@/types/options";
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
import { useMutation } from "@tanstack/react-query";
import React, { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import FormProgress from "./FormProgress";

export const CreateForm: FC<ICreateFormProps> = ({
  elements,
  onSuccess,
  loading = false,
  error,
  submitButton,
  actionsContainerProps,
  leadingContent,
  onCVParsed,
  showProgress = false,
  mode = "normal",
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

  const parseCVMutation = useMutation({
    mutationFn: parseCVViaAPI,
  });

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [step, setStep] = useState<number>(0);
  const { data, isLoading } = useSapModules();
  const cvParsing = parseCVMutation.isPending;
  const cvParsed = parseCVMutation.isSuccess;
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

    if (fieldName !== "cv") return;

    parseCVMutation.mutate(file, {
      onSuccess: (parsedResponse) => {
        const { user, consultant } = parsedResponse;

        const formValues = {
          fullName: user?.username ?? "",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
          city: user?.city ?? "",
          country: user?.country ?? "",
          experience: consultant?.experience ?? "",
          rate: consultant?.rate ?? "",
          weekly_available_hours: consultant?.weekly_available_hours ?? "",
          coreModule: consultant?.core_module ?? [],
          otherModule: consultant?.other_module ?? [],
        };

        Object.entries(formValues).forEach(([key, value]) => {
          setValue(key, value, {
            shouldDirty: true,
            shouldValidate: true,
          });
        });

        if (onCVParsed) {
          onCVParsed({
            __cvPayload: parsedResponse,
            __formValues: formValues,
          });
        }
      },
    });
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

  const renderField = (element: IFieldConfig) => {
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
      <FormControl fullWidth sx={{ width: "100%" }} key={element.name}>
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
                    hidden
                    accept={element.inputProps?.accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelection(file, element.name, field.onChange);
                      }
                    }}
                  />

                  <label
                    htmlFor={element.name}
                    onDrop={(e) =>
                      handleFileDrop(e, element.name, field.onChange)
                    }
                    style={{ cursor: "pointer", display: "block" }}
                  >
                    {cvParsing ? (
                      <>
                        <Typography fontWeight="bold" color="#4680FF">
                          Parsing CV… Please wait
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fileNames[element.name]}
                        </Typography>
                      </>
                    ) : cvParsed ? (
                      <>
                        <Typography fontWeight="bold" color="green">
                          CV parsed successfully ✓
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fileNames[element.name]}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography fontWeight="bold" color="#4680FF">
                          {fileNames[element.name] || element.label || "Upload"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click or drag to choose a file (.pdf, .doc, .docx)
                        </Typography>
                      </>
                    )}
                  </label>
                </Box>
              );
            }

            return (
              <TextField
                {...field}
                fullWidth
                size="small"
                label={element.label}
                placeholder={element.placeholder}
                type={
                  isPassword
                    ? showPassword[element.name]
                      ? "text"
                      : "password"
                    : element.type || "text"
                }
                error={!!errors[element.name]}
                helperText={errors[element.name]?.message?.toString()}
                disabled={loading || isLoading}
                select={isSelect}
                slotProps={{
                  select: {
                    multiple: element.multiple === true,
                    displayEmpty: true,
                    renderValue: (selected: any) => {
                      if (
                        !selected ||
                        (Array.isArray(selected) && selected.length === 0)
                      ) {
                        return (
                          <Typography color="gray">
                            Select {element.label}
                          </Typography>
                        );
                      }

                      if (Array.isArray(selected)) {
                        return selected
                          .map((val) => {
                            const opt =
                              element.options?.find((o) => o.value === val) ||
                              dynamicOptions[element.name]?.find(
                                (o) => o.value === val
                              );
                            return opt?.label ?? val;
                          })
                          .join(", ");
                      }

                      const opt =
                        element.options?.find((o) => o.value === selected) ||
                        dynamicOptions[element.name]?.find(
                          (o) => o.value === selected
                        );

                      return opt?.label ?? String(selected);
                    },
                  },

                  inputLabel: {
                    shrink: true,
                  },

                  htmlInput: element.inputProps,

                  input: isPassword
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => handleTogglePassword(element.name)}
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
                }}
              >
                {!element.multiple && (
                  <MenuItem value="">
                    <em>{element.placeholder ?? `Select ${element.label}`}</em>
                  </MenuItem>
                )}

                {(element.options ?? dynamicOptions[element.name] ?? []).map(
                  (opt) => (
                    <MenuItem key={String(opt.value)} value={opt.value}>
                      {element.multiple && (
                        <input
                          type="checkbox"
                          checked={
                            Array.isArray(field.value) &&
                            field.value.includes(opt.value)
                          }
                          readOnly
                          style={{ marginRight: 8 }}
                        />
                      )}
                      {opt.label}
                    </MenuItem>
                  )
                )}
              </TextField>
            );
          }}
        />
      </FormControl>
    );
  };

  const renderCurrentField = () => {
    const element = elements[step];
    if (!element) return null;
    return renderField(element);
  };

  const generateSpans = (
    type: "row" | "column",
    spans?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    }
  ) => {
    const defaultSpan = type === "row" ? 1 : 12;

    const result: Record<string, string> = {
      xs: `span ${defaultSpan}`,
    };

    if (!spans) return result;

    (["xs", "sm", "md", "lg", "xl"] as const).forEach((bp) => {
      if (spans[bp] !== undefined) {
        result[bp] = `span ${spans[bp]}`;
      }
    });

    return result;
  };

  const renderAllFields = () => {
    return (
      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "20px",
        }}
      >
        {elements.map((element) => (
          <FormControl
            key={element.name}
            sx={{
              width: "100%",
              gridColumn: generateSpans("column", element.column),
              gridRow: generateSpans("row", element.row),
            }}
          >
            {renderField(element)}
          </FormControl>
        ))}
      </Box>
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

    setStep((s) => Math.min(s + 1, elements.length - 1));
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)}>
      {mode === "wizard" && showProgress && (
        <FormProgress currentStep={step} totalSteps={elements.length} />
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {leadingContent ? (
        <Box sx={{ mt: 2, display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box sx={{ flexShrink: 0 }}>{leadingContent}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>{renderCurrentField()}</Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          {mode === "wizard" ? renderCurrentField() : renderAllFields()}
        </Box>
      )}

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mt: 3, ...actionsContainerProps?.sx }}
      >
        {mode === "wizard" ? (
          <>
            {step > 0 && (
              <AppButton
                label="Back"
                onClick={goPrev}
                sx={{ width: "auto", minWidth: "160px" }}
              />
            )}

            {step === elements.length - 1 ? (
              <AppButton
                label={String(submitButton?.children || "Submit")}
                color="primary"
                onClick={handleSubmit(submitHandler)}
                loading={loading}
                sx={{ width: "auto", minWidth: "160px", ...submitButton?.sx }}
              />
            ) : (
              <AppButton
                label="Next"
                onClick={goNext}
                disabled={cvParsing}
                sx={{ width: "auto", minWidth: "160px" }}
              />
            )}
          </>
        ) : (
          <AppButton
            label={String(submitButton?.children || "Submit")}
            loading={loading || cvParsing}
            disabled={cvParsing}
            onClick={handleSubmit(submitHandler)}
            sx={{ width: "auto", minWidth: "160px", ...submitButton?.sx }}
          />
        )}
      </Stack>
    </Box>
  );
};
