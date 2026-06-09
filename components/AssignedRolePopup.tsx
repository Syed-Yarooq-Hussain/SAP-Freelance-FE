"use client";

import { useConsultantLevels } from "@/actions/common/useConsultantLevels";
import DynamicModal from "@/components/DynamicModal";
import type { CandidateRow } from "@/types/teamBuilder";
import {
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AppButton from "./Button";

const CONTRACTS = ["NDA", "Service", "Property ownership", "Project contract"];

type AssignedRolePopupProps = {
  open: boolean;
  onClose: () => void;
  row: CandidateRow | null;
  projectId: string | number;
  onUpdated: () => void;
  onAssign: (role: string, contracts: string[]) => void;
};

export function AssignedRolePopup({
  open,
  onClose,
  row,
  onAssign,
}: AssignedRolePopupProps) {
  const [selectedContracts, setContracts] = useState<string[]>([]);
  const [selectedRole, setRole] = useState("");
  const consultantLevels = useConsultantLevels();

  useEffect(() => {
    if (open) {
      consultantLevels.mutate();
      setRole("");
      setContracts([]);
    }
  }, [open]);

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title="Assigned Role"
      width={480}
      actions={
        <>
          <AppButton
            label="Assign"
            onClick={() => onAssign(selectedRole, selectedContracts)}
            disabled={!selectedRole || selectedContracts.length === 0}
            colorKey="BLUE"
            width={180}
            sx={{
              fontWeight: 600,
              px: 4,
              py: 1,
            }}
          />
        </>
      }
    >
      {row && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            src={row.avatar}
            sx={{ width: 48, height: 48, bgcolor: "#e5e7eb" }}
          />

          <Box>
            <Typography fontWeight={700} sx={{ fontSize: "1rem" }}>
              {row.name || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.coremodules || row.othersmodules
                ? `${row.coremodules ?? ""} ${row.othersmodules ?? ""}`.trim()
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      )}

      <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 1 }}>
        Contract
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, mb: 3 }}>
        {CONTRACTS.map((c) => (
          <FormControlLabel
            key={c}
            control={
              <Checkbox
                checked={selectedContracts.includes(c)}
                onChange={() =>
                  setContracts((prev) =>
                    prev.includes(c)
                      ? prev.filter((x) => x !== c)
                      : [...prev, c]
                  )
                }
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textDecoration: "underline",
                  color: "#374151",
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                {c}
              </Typography>
            }
          />
        ))}
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 1 }}>
        Role
      </Typography>

      <TextField
        select
        fullWidth
        size="small"
        value={selectedRole}
        onChange={(e) => setRole(e.target.value)}
        slotProps={{
          select: {
            displayEmpty: true,
            renderValue: (selected: unknown) =>
              selected ? (
                (selected as string)
              ) : (
                <span style={{ color: "#9CA3AF" }}>Select role</span>
              ),
          },
        }}
        sx={{
          ".MuiInputBase-root": {
            borderRadius: 1,
            bgcolor: "#F9FAFB",
          },
        }}
      >
        <MenuItem value="">
          <span style={{ color: "#9CA3AF" }}>Select role</span>
        </MenuItem>

        {consultantLevels.isPending && <MenuItem disabled>Loading...</MenuItem>}

        {consultantLevels.data?.data?.map((level) => (
          <MenuItem key={level} value={level}>
            {level}
          </MenuItem>
        ))}
      </TextField>
    </DynamicModal>
  );
}
