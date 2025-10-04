import AppButton from "@/components/Button";
import { IOption } from "@/types/options";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  BaseTextFieldProps,
  Box,
  ButtonProps,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  StackProps,
  TextField,
} from "@mui/material";
import { ResponsiveStyleValue } from "@mui/system";
import { FC, useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = (data: FieldValues) => {
    onSuccess(data);
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
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
                    type={
                      element.name === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : element.name === "confirmPassword"
                        ? showConfirmPassword
                          ? "text"
                          : "password"
                        : "text"
                    } // Ensure the toggle is only for password fields
                    error={!!errors[element.name]}
                    helperText={errors[element.name]?.message?.toString()}
                    disabled={loading}
                    placeholder={element.placeholder}
                    label={element.label}
                    slotProps={{
                      input: {
                        endAdornment:
                          element.name === "password" ||
                          element.name === "confirmPassword" ? ( // Apply the visibility toggle only to Password and Confirm Password
                            <InputAdornment position="end">
                              <IconButton
                                onClick={
                                  element.name === "password"
                                    ? handleClickShowPassword
                                    : handleClickShowConfirmPassword
                                }
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {element.name === "password" ? (
                                  showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )
                                ) : showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ) : undefined,
                      },
                    }}
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
