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
import { FC, ReactNode } from "react";
import React, { FC, useRef, useState } from "react";
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
  if (!spans || Object.keys(spans).length === 0)
    return { xs: `span ${defaultSpan}` };

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

  const handleFileDrop = async (
    e: React.DragEvent<HTMLLabelElement>,
    fieldName: string,
    onChange: (value: File | null) => void
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFileSelection(file, fieldName, onChange);
  };

  const fieldsGrid = (
    <Box
      sx={{
        mt: 2,
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "repeat(12, 1fr)",
      }}
    >
      {elements.map((element) => {
        const gridColumn = generateSpans("column", element.column);
        const gridRow = generateSpans("row", element.row);

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
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  variant="outlined"
                  type={element.type || "text"}
                  error={!!errors[element.name]}
                  helperText={errors[element.name]?.message?.toString()}
                  disabled={loading}
                  placeholder={element.placeholder}
                  slotProps={{
                    inputLabel: { shrink: true },
                    select: {
                      displayEmpty: true,
                      renderValue: (value) => {
                        if (!value) {
                          return (
                            <Typography color="gray">
                              Select {element.label}
                            </Typography>
                          );
                        }
                        return <>{value}</>;
                      },
                    },
                  }}
                  label={element.label}
                  {...element}
                >
                  {element.options?.length !== 0 &&
                    element.options?.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />
          </FormControl>
        );
      })}
    </Box>
  );

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
          <Box sx={{ flex: 1, minWidth: 0 }}>{fieldsGrid}</Box>
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

          <Box sx={{ flex: 1, minWidth: 0 }}>{fieldsGrid}</Box>
        </Box>
      ) : (
        fieldsGrid
      )}

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mt: 3, ...actionsContainerProps?.sx }}
        {...actionsContainerProps}
      >
        <AppButton
          label={String(submitButton?.children || "Submit")}
          color="primary"
          onClick={handleSubmit(submitHandler)}
          loading={loading}
          sx={{ width: "auto", minWidth: "160px", ...submitButton?.sx }}
        />
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
