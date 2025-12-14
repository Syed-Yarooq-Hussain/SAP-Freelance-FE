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
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { ResponsiveStyleValue } from "@mui/system";
import React, { FC, ReactNode, useRef, useState } from "react";
import {
  Controller,
  FieldValues,
  RegisterOptions,
  useForm,
} from "react-hook-form";

export interface IGridSpan {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface IFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  rules?: RegisterOptions;
  options?: IOption[];
  column?: IGridSpan;
  row?: IGridSpan;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  select?: boolean;
  defaultValue?: string | number | boolean | null;
  hidden?: boolean;
}

interface ICreateFormProps {
  elements: IFieldConfig[];
  onSuccess: (data: FieldValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  onCVParsed?: (cvData: Partial<FieldValues>) => void;
  actionsContainerProps?: StackProps;
  submitButton?: ButtonProps;
  cancelButton?: ButtonProps;
  leadingContent?: ReactNode;
  inlineActions?: boolean;
}

const generateSpans = (type: "row" | "column", spans?: IGridSpan) => {
  const defaultSpan = type === "row" ? 1 : 12;
  if (!spans || Object.keys(spans).length === 0) {
    return { xs: `span ${defaultSpan}` };
  }

  const result: ResponsiveStyleValue<string> = {};
  (["xs", "sm", "md", "lg", "xl"] as const).forEach((bp) => {
    if (spans[bp] !== undefined) result[bp] = `span ${spans[bp]}`;
  });
  return result;
};

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
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const autoFilledRef = useRef<Set<string>>(new Set());

  const handleTogglePassword = (name: string) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

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

  const renderFieldsGrid = () => (
    <Box
      sx={{
        mt: 2,
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "repeat(12, 1fr)",
      }}
    >
      {elements.map((element) => {
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
        const gridColumn = generateSpans("column", element.column);
        const gridRow = generateSpans("row", element.row);
        const isPassword = element.type === "password";
        const isFile = element.type === "file";
        const isSelect = !!element.options?.length;

        return (
          <FormControl
            key={element.name}
            sx={{ gridColumn, gridRow, width: "100%" }}
          >
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
                          if (file)
                            handleFileSelection(
                              file,
                              element.name,
                              field.onChange
                            );
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
                    disabled={loading}
                    placeholder={element.placeholder}
                    select={isSelect}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: element.inputProps,
                      input: isPassword
                        ? {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    handleTogglePassword(element.name)
                                  }
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
                              return value as React.ReactNode;
                            },
                          }
                        : undefined,
                    }}
                  >
                    {isSelect &&
                      element.options?.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                  </TextField>
                );
              }}
            />
          </FormControl>
        );
      })}
    </Box>
  );

  const submitHandler = (data: FieldValues) => {
    onSuccess(data);
  };

  const submitButtonNode = (
    <AppButton
      label={String(submitButton?.children || "Submit")}
      color="primary"
      onClick={handleSubmit(submitHandler)}
      loading={loading}
      sx={{ width: "auto", minWidth: "160px", ...submitButton?.sx }}
    />
  );

  if (inlineActions) {
    return (
      <Box component="form" onSubmit={handleSubmit(submitHandler)}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>{renderFieldsGrid()}</Box>
          {submitButtonNode}
        </Box>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)}>
      {error && <Alert severity="error">{error}</Alert>}

      {leadingContent ? (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flexShrink: 0 }}>{leadingContent}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>{renderFieldsGrid()}</Box>
        </Box>
      ) : (
        renderFieldsGrid()
      )}

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mt: 3, ...actionsContainerProps?.sx }}
        {...actionsContainerProps}
      >
        {submitButtonNode}
        {onCancel && (
          <AppButton
            label={String(cancelButton?.children || "Cancel")}
            color="secondary"
            onClick={onCancel}
            sx={{ width: "auto", minWidth: "160px", ...cancelButton?.sx }}
          />
        )}
      </Stack>
    </Box>
  );
};
