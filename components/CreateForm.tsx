"use client";

import {
  Alert,
  BaseTextFieldProps,
  Box,
  Button,
  ButtonProps,
  FormControl,
  Stack,
  StackProps,
  TextField,
} from "@mui/material";
import { ResponsiveStyleValue } from "@mui/system";
import { FC } from "react";
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
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
                    InputLabelProps={{ shrink: true }}
                    {...element}
                    label={element.label}
                  />
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
          loading={loading}
          loadingPosition="start"
          {...submitButton}
        >
          {submitButton?.children || "Submit"}
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
