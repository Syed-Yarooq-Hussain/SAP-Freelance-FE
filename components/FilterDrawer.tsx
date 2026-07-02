"use client";

import { countries } from "@/utils/common";
import SapModulesDropdown from "@/components/profile/profile-edit/SapModulesDropdown";
import { useSapOtherModules } from "@/actions/common/useSapModules";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters:any) => void;
}

export default function FilterDrawer({ open, onClose, onApply }: FilterDrawerProps) {
  const [filters, setFilters] = useState({
    experience: "9",
    availability: "20",
    budgetMax: "",
    budgetMin: "",
    country: "",
  });
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const { data: sapOtherModulesData } = useSapOtherModules();
  const moduleDropdownData = sapOtherModulesData?.data || [];
  const [modulesModalOpen, setModulesModalOpen] = useState(false);

  const handleApply = () => {
    onApply({
      ...filters,
      modules: selectedModules,
    });
  };

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
      <Box mb={2}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setModulesModalOpen(true)}
          sx={{
            justifyContent: "space-between",
            textTransform: "none",
            borderColor: "#cbd5e1",
            color: "#334155",
            borderRadius: "10px",
            py: 1.1,
            px: 1.5,
            fontSize: "0.85rem",
            fontWeight: 500,
            backgroundColor: "#fff",
            "&:hover": {
              borderColor: "#4A7AB5",
              backgroundColor: "#f8fbff",
            },
          }}
        >
          <span>{selectedModules.length > 0 ? `${selectedModules.length} selected` : "Select modules"}</span>
          <span style={{ color: "#4A7AB5", fontWeight: 600 }}>Open</span>
        </Button>
      </Box>

      <Dialog
        open={modulesModalOpen}
        onClose={() => setModulesModalOpen(false)}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "14px",
            overflow: "visible",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            pb: 1,
          }}
        >
          Select Core Modules
        </DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <SapModulesDropdown
            data={moduleDropdownData}
            values={selectedModules}
            onChange={setSelectedModules}
            panelZIndex={1600}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              onClick={() => setModulesModalOpen(false)}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                backgroundColor: "#4A7AB5",
              }}
            >
              Done
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        Experience level
      </Typography>
      <TextField
        size="small"
        fullWidth
        type="number"
        value={filters.experience}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, experience: e.target.value }))
        }
        placeholder="Enter experience (years)"
        inputProps={{ min: 0 }}
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        Availability (hr/week)
      </Typography>
      <TextField
        size="small"
        fullWidth
        type="number"
        value={filters.availability}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, availability: e.target.value }))
        }
        placeholder="Enter availability (hr/week)"
        inputProps={{ min: 0 }}
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        Budget
      </Typography>
      <Box display="flex" gap={1} mb={2}>
        <TextField
          size="small"
          placeholder="Min"
          fullWidth
          type="number"
          value={filters.budgetMin}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, budgetMin: e.target.value }))
          }
        />
        <TextField
          size="small"
          placeholder="Max"
          fullWidth
          type="number"
          value={filters.budgetMax}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, budgetMax: e.target.value }))
          }
        />
      </Box>

      <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
        Country
      </Typography>
      <TextField
        select
        size="small"
        fullWidth
        value={filters.country}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, country: e.target.value }))
        }
        SelectProps={{
          displayEmpty: true,
          renderValue: (value) =>
            value ? String(value) : "Select Country",
        }}
        sx={{ mb: 2 }}
      >
        <MenuItem value="" disabled>Select Country</MenuItem>
        {
          countries.map((country: any) => (
            <MenuItem key={country} value={country.toLowerCase()}>{country}</MenuItem>
          ))
        }
      </TextField>
      <Button variant="contained" onClick={handleApply}>Apply</Button>
    </Drawer>
  );
}
