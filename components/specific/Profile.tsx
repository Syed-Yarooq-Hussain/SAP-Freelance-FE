"use client";
import { clientProfileData } from "@/data/clientProfile";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { usePathname } from "next/navigation";

type SectionType = "experience" | "education" | "reviews";

interface ProfileSectionProps {
  section: SectionType;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ section }) => {
  const pathname = usePathname();
  const isEditMode = pathname === "/client/profile/updateProfile";

  if (section === "experience") {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Experience</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {clientProfileData.experienceList.map((exp, i) => (
            <Grid key={`exp-${i}`} size={{ xs: 12, md: 4 }}>
              <Box sx={{ borderLeft: "3px solid #f50057", p: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{exp.title}</Typography>
                <Typography sx={{ fontWeight: 500, mt: 1, fontSize: 13 }}>Client: <b>{exp.client}</b></Typography>
                <Typography sx={{ fontWeight: 500, mt: 1, fontSize: 13 }}>Role: <b>{exp.role}</b></Typography>
                <Typography sx={{ fontWeight: 500, mt: 1, fontSize: 13 }}>Duration: <b>{exp.duration}</b></Typography>
                <Typography sx={{ fontWeight: 500, mt: 1, fontSize: 13 }}>Technologies: <b>{exp.technologies}</b></Typography>
                {isEditMode && (
                  <Stack direction="row" mt={1}>
                    <IconButton size="small"><BorderColorIcon sx={{ color: "#4b75f2", fontSize: 20 }} /></IconButton>
                    <IconButton size="small"><DeleteForeverIcon sx={{ color: "#f44336", fontSize: 20 }} /></IconButton>
                  </Stack>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (section === "education") {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Education & Certifications</Typography>
        <ul style={{ listStyleType: "disc", paddingLeft: 40, margin: 0 }}>
          {clientProfileData.education.map((edu, index) => (
            <li key={`edu-${index}`} style={{ marginBottom: "6px" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography component="span" sx={{ fontWeight: 600 }}>{edu}</Typography>
                {isEditMode && (
                  <Stack direction="row">
                    <IconButton size="small"><DeleteForeverIcon sx={{ color: "#4b75f2", fontSize: 20 }} /></IconButton>
                    <IconButton size="small"><BorderColorIcon sx={{ color: "#f44336", fontSize: 20 }} /></IconButton>
                  </Stack>
                )}
              </Stack>
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  if (section === "reviews") {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 3 }}>Reviews & Ratings</Typography>
        <Grid container spacing={4}>
          {clientProfileData.reviews.map((rev, index) => (
            <Grid key={`rev-${index}`} size={{ xs: 12, md: 4 }} sx={{ borderLeft: "3px solid #4985eeff", height: "6.5rem", pl: 2 }}>
              <Typography variant="body2" sx={{ color: "gray", mt: 2, mb: 0.5 }}>
                Client: <span style={{ fontWeight: 600, color: "black" }}>{rev.client}</span>
              </Typography>
              <Typography variant="body2" sx={{ color: "gray", mb: 0.5 }}>
                Rating: <span style={{ fontWeight: 600, color: "black" }}>{rev.rating}</span>
              </Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                <span style={{ fontWeight: 600, color: "black" }}>{rev.comment}</span>
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return null;
};

// Alag-alag export for separate imports
export const ProfileExperience = () => <ProfileSection section="experience" />;
export const ProfileEducation = () => <ProfileSection section="education" />;
export const ProfileReview = () => <ProfileSection section="reviews" />;
