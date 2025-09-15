'use client';

import * as React from 'react';
import { Controller, Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

interface IFormControllerProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  rules?: object;
}

const FormController = <T extends FieldValues>({
  name,
  control,
  errors,
  rules,
  label,
  ...rest
}: IFormControllerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          fullWidth
          label={label}
          margin="normal"
          error={!!errors[name]}
          helperText={(errors[name]?.message as string) || ''}
        />
      )}
    />
  );
};

export default FormController;
