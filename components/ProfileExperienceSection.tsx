"use client";

import { ProfileData } from "@/types/profile";
import { Grid, Typography } from "@mui/material";
import EmptyState from "./EmptyStats";
import ExperienceCard from "./ProfileExperienceCard";

type Experience = ProfileData["experienceList"][number];

interface Props {
  experiences: Experience[];
  editable: boolean;
  onChange: (experiences: Experience[]) => void;
}

const ExperienceSection = ({ experiences, editable, onChange }: Props) => {
  const update = (index: number, exp: Experience) => {
    const copy = [...experiences];
    copy[index] = exp;
    onChange(copy);
  };

  const remove = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  return (
    <>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Work Experience
      </Typography>

      {experiences.length === 0 ? (
        <EmptyState text="No work experience added yet" />
      ) : (
        <Grid container spacing={2}>
          {experiences.map((exp, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <ExperienceCard
                experience={exp}
                editable={editable}
                onSave={(updated) => update(i, updated)}
                onDelete={() => remove(i)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ExperienceSection;
