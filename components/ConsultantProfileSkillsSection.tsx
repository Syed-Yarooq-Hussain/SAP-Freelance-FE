"use client";

import { CreateForm } from "@/components/CreateForm";
import { skillFormElements } from "@/forms/consultantProfileForm";
import { colors } from "@/utils/styles/colors";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { FieldValues } from "react-hook-form";
import EmptyState from "./EmptyStats";

interface Props {
  skills: string[];
  editable: boolean;
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
}

const formatSkill = (skill: string) =>
  skill
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const ProfileSkillsSection = ({ skills, editable, onAdd, onRemove }: Props) => {
  const handleSubmit = (data: FieldValues) => {
    const raw = (data.skill as string)?.trim();
    if (!raw) return;
    onAdd(formatSkill(raw));
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700}>
        Skills &amp; Expertise
      </Typography>

      {editable && (
        <Grid container spacing={2} mt={1}>
          <Grid size={{ xs: 12, md: 8 }}>
            <CreateForm
              elements={skillFormElements}
              onSuccess={handleSubmit}
              inlineActions
              submitButton={{
                children: "Add Skill",
                sx: { minWidth: 180 },
              }}
            />
          </Grid>
        </Grid>
      )}

      {skills.length === 0 ? (
        <EmptyState text="No skills added yet" />
      ) : (
        <Box display="flex" flexWrap="wrap" gap={1.5} mt={3}>
          {skills.map((skill, i) => (
            <Box
              key={i}
              sx={{
                border: "1.5px solid #1069f9ff",
                color: colors.BLUE,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography variant="body2">{skill}</Typography>
              {editable && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(skill)}
                  sx={{ color: colors.BLUE, p: 0.25 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProfileSkillsSection;
