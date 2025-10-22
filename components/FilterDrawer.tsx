"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function FilterDrawer({ open, onClose }: FilterDrawerProps) {
  const [filters] = useState({
    modules: {
      MM: true,
      FICO: true,
      SD: true,
      CO: false,
      QM: false,
      HR: false,
      ABAP: false,
      PP: false,
      BW: false,
    },
    experience: "9 years",
    availability: "20",
    budgetMax: "",
    budgetMin: "",
    country: "Junior",
  });

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            top: 50,
            height: "calc(100% - 50px)",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            boxShadow: 4,
            width: 320,
            p: 2.5,
          },
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
          Filters
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        Core Modules
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(2,1fr)" gap={0.5} mb={2}>
        {Object.keys(filters.modules).map((key) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                defaultChecked={
                  filters.modules[key as keyof typeof filters.modules]
                }
              />
            }
            label={key}
            sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.85rem" } }}
          />
        ))}
      </Box>

      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        Experience level
      </Typography>
      <TextField
        select
        size="small"
        fullWidth
        value={filters.experience}
        sx={{ mb: 2 }}
      >
        <MenuItem value="9 years">9 years</MenuItem>
        <MenuItem value="10 years">10 years</MenuItem>
        <MenuItem value="5 years">5 years</MenuItem>
      </TextField>

      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        Availability (hr/week)
      </Typography>
      <TextField
        select
        size="small"
        fullWidth
        value={filters.availability}
        sx={{ mb: 2 }}
      >
        <MenuItem value="20">20</MenuItem>
        <MenuItem value="40">40</MenuItem>
      </TextField>

      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        Budget
      </Typography>
      <Box display="flex" gap={1} mb={2}>
        <TextField size="small" placeholder="Min" fullWidth />
        <TextField size="small" placeholder="Max" fullWidth />
      </Box>

      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        Country
      </Typography>
      <TextField
        select
        size="small"
        fullWidth
        value={filters.country}
        sx={{ mb: 2 }}
      >
        <MenuItem value="Junior">Junior</MenuItem>
        <MenuItem value="Senior">Senior</MenuItem>
        <MenuItem value="Mid">Mid</MenuItem>
      </TextField>
    </Drawer>
  );
}
