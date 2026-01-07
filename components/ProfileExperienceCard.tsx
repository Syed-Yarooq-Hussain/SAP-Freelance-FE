"use client";

import AppButton from "@/components/Button";
import { ProfileData } from "@/types/profile";
import { colors } from "@/utils/styles/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

type Experience = ProfileData["experienceList"][number];

interface Props {
  experience: Experience;
  editable: boolean;
  onSave: (exp: Experience) => void;
  onDelete: () => void;
}

const ExperienceCard = ({ experience, editable, onSave, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Experience>(experience);

  const update =
    (key: keyof Experience) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((p) => ({ ...p, [key]: e.target.value }));

  const cancel = () => {
    setDraft(experience);
    setIsEditing(false);
  };

  const save = () => {
    onSave(draft);
    setIsEditing(false);
  };

  return (
    <Box sx={{ borderLeft: "3px solid #005C8A", p: 2 }}>
      {isEditing ? (
        <>
          <TextField
            label="Company"
            value={draft.title}
            onChange={update("title")}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Role"
            value={draft.role}
            onChange={update("role")}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Duration"
            value={draft.duration}
            onChange={update("duration")}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Responsibilities"
            value={draft.technologies || ""}
            onChange={update("technologies")}
            fullWidth
            multiline
            rows={3}
            size="small"
          />

          <Stack direction="row" spacing={1} mt={2}>
            <AppButton label="Save" onClick={save} />
            <AppButton label="Cancel" colorKey="RED" onClick={cancel} />
          </Stack>
        </>
      ) : (
        <>
          <Typography fontWeight={600}>{experience.title}</Typography>

          <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
            Role: <span style={{ color: "black" }}>{experience.role}</span>
          </Typography>

          <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
            Duration:{" "}
            <span style={{ color: "black" }}>{experience.duration}</span>
          </Typography>

          {experience.technologies && (
            <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
              Responsibilities:{" "}
              <span style={{ color: "black" }}>{experience.technologies}</span>
            </Typography>
          )}

          {editable && (
            <Stack direction="row" mt={1}>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  sx={{ color: colors.BLUE }}
                  onClick={() => setIsEditing(true)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  sx={{ color: colors.RED }}
                  onClick={onDelete}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default ExperienceCard;
