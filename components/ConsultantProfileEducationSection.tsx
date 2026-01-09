"use client";

import { colors } from "@/utils/styles/colors";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import EmptyState from "./EmptyStats";

interface Props {
  education: string[];
  editable: boolean;
  onChange: (updated: string[]) => void;
}

const ProfileEducationSection = ({ education, editable, onChange }: Props) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setDraft(education[index]);
  };

  const save = () => {
    if (editingIndex === null) return;
    const copy = [...education];
    copy[editingIndex] = draft.trim();
    onChange(copy);
    setEditingIndex(null);
  };

  const cancel = () => {
    setEditingIndex(null);
    setDraft("");
  };

  const remove = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Education & Certifications
      </Typography>

      {education.length === 0 ? (
        <EmptyState text="No education added yet" />
      ) : (
        <Grid container spacing={2}>
          {education.map((edu, index) => (
            <Grid key={index} size={{ xs: 12 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                {editingIndex === index ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                ) : (
                  <Typography variant="body2">{edu}</Typography>
                )}

                {editable && (
                  <Stack direction="row">
                    {editingIndex === index ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton
                            size="small"
                            sx={{ color: colors.BLUE }}
                            onClick={save}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Cancel">
                          <IconButton
                            size="small"
                            sx={{ color: colors.RED }}
                            onClick={cancel}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            sx={{ color: colors.BLUE }}
                            onClick={() => startEdit(index)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            sx={{ color: colors.RED }}
                            onClick={() => remove(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProfileEducationSection;
