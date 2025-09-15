'use client';

import * as React from 'react';
import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Controller,
  Control,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';

type DayAvailability = {
  day: string;
  enabled: boolean;
  start?: string;
  end?: string;
};

interface IAvailabilityScheduleProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function AvailabilitySchedule<T extends FieldValues>({
  name,
  control,
  errors,
}: IAvailabilityScheduleProps<T>) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        Availability Schedule
      </Typography>

      {weekdays.map((day, index) => (
        <Controller
          key={day}
          name={`${name}.${index}` as Path<T>}
          control={control}
          defaultValue={
            { day, enabled: false, start: '', end: '' } as unknown as PathValue<T, Path<T>>
          }
          rules={{
            validate: (value: DayAvailability) => {
              if (value.enabled) {
                if (!value.start || !value.end) return `${day}: Start and End time are required`;
              }
              return true;
            },
          }}
          render={({ field }) => {
            const fieldErrors = errors[name] as unknown;
            const errorArray = Array.isArray(fieldErrors) ? fieldErrors : [];
            const dayError = errorArray[index] as { message?: string } | undefined;

            return (
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value?.enabled || false}
                      onChange={(e) =>
                        field.onChange({ ...field.value, enabled: e.target.checked })
                      }
                    />
                  }
                  label={day}
                />

                {field.value?.enabled && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={6}>
                      <TextField
                        type="time"
                        label="Start"
                        value={field.value?.start || ''}
                        onChange={(e) =>
                          field.onChange({ ...field.value, start: e.target.value })
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!dayError}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        type="time"
                        label="End"
                        value={field.value?.end || ''}
                        onChange={(e) =>
                          field.onChange({ ...field.value, end: e.target.value })
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!dayError}
                        helperText={dayError?.message || ''}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            );
          }}
        />
      ))}
    </Box>
  );
}

export default AvailabilitySchedule;
