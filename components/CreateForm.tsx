"use client";

import { IOption } from "@/types/options";
import {
  Alert,
  BaseTextFieldProps,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  FormControl,
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { ResponsiveStyleValue } from "@mui/system";
import React, { FC } from "react";
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

export interface IFieldConfig extends BaseTextFieldProps {
  name: string;
  rules?: RegisterOptions;
  column?: IGridSpan;
  row?: IGridSpan;
  type?: string;
  options?: IOption[];
  onChange?: (e: React.ChangeEvent<any>) => void;
}

interface ICreateFormProps {
  elements: IFieldConfig[];
  onSuccess: (data: FieldValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  actionsContainerProps?: StackProps;
  submitButton?: ButtonProps;
  cancelButton?: ButtonProps;
  onFormReady?: (helpers: { setValue: any }) => void;
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
  onFormReady,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  React.useEffect(() => {
    if (typeof onFormReady === "function") {
      onFormReady({ setValue });
    }
  }, [onFormReady, setValue]);

  const submitHandler = (data: FieldValues) => {
    onSuccess(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)}>
      {error && <Alert severity="error">{error}</Alert>}

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
                    onChange={(e) => {
                      field.onChange(e);
                      element.onChange?.(e);
                    }}
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
                    label={element.label}                >
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

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mt: 3, ...actionsContainerProps?.sx }}
        {...actionsContainerProps}
      >
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={loading}
          {...submitButton}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            submitButton?.children || "Submit"
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outlined"
            color="error"
            size="small"
            onClick={onCancel}
            {...cancelButton}
          >
            {cancelButton?.children || "Cancel"}
          </Button>
        )}
      </Stack>
    </Box>
  );
};
