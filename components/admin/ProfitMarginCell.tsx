"use client";

import { useUpdateClientProfitMargin } from "@/actions/admin/useAdminClientManagement";
import { useToast } from "@/providers/ToastProvider";
import { parseProfitMargin } from "@/utils/adminClientValidation";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type ProfitMarginCellProps = {
  clientId: number;
  value: number;
};

export default function ProfitMarginCell({
  clientId,
  value,
}: ProfitMarginCellProps) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(String(value));
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const updateMargin = useUpdateClientProfitMargin();
  const { toast } = useToast();

  useEffect(() => {
    if (!editing) setInput(String(value));
  }, [editing, value]);

  const cancel = () => {
    setInput(String(value));
    setError("");
    setEditing(false);
    updateMargin.reset();
  };

  const persist = (nextValue: number) => {
    updateMargin.mutate(
      { clientId, profitMarginPercentage: nextValue },
      {
        onSuccess: () => {
          toast("Profit margin updated successfully.", "success");
          setEditing(false);
          setConfirmOpen(false);
          setError("");
        },
        onError: (requestError) => {
          setConfirmOpen(false);
          setError(requestError.message);
        },
      }
    );
  };

  const requestSave = () => {
    const result = parseProfitMargin(input);
    if (result.error || result.value === undefined) {
      setError(result.error ?? "Invalid profit margin.");
      return;
    }
    if (result.value === value) {
      setEditing(false);
      return;
    }
    if (value > 0) {
      setConfirmOpen(true);
      return;
    }
    persist(result.value);
  };

  return (
    <Box onClick={(event) => event.stopPropagation()} sx={{ minWidth: 210, py: 0.5 }}>
      {!editing ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontWeight: 700 }}>{value}%</Typography>
          <Button size="small" onClick={() => setEditing(true)}>Edit</Button>
        </Stack>
      ) : (
        <Stack spacing={0.75}>
          <Stack direction="row" spacing={0.75} alignItems="flex-start">
            <TextField
              size="small"
              value={input}
              type="number"
              error={Boolean(error)}
              inputProps={{ min: 0, step: 1, inputMode: "numeric" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              onChange={(event) => {
                setInput(event.target.value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") requestSave();
                if (event.key === "Escape") cancel();
              }}
              disabled={updateMargin.isPending}
              sx={{ width: 105 }}
            />
            <Button size="small" onClick={requestSave} disabled={updateMargin.isPending}>
              {updateMargin.isPending ? "Saving" : "Save"}
            </Button>
            <Button size="small" color="inherit" onClick={cancel} disabled={updateMargin.isPending}>
              Cancel
            </Button>
          </Stack>
          {error ? <Alert severity="error" sx={{ py: 0 }}>{error}</Alert> : null}
        </Stack>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 750 }}>Replace profit margin?</DialogTitle>
        <DialogContent>
          This client currently has a {value}% margin. Replace it with {input}%?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={updateMargin.isPending}>Keep current</Button>
          <Button
            variant="contained"
            onClick={() => {
              const parsed = parseProfitMargin(input);
              if (parsed.value !== undefined) persist(parsed.value);
            }}
            disabled={updateMargin.isPending}
          >
            {updateMargin.isPending ? "Saving..." : "Replace"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
