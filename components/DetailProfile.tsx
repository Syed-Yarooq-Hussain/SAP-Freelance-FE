"use client";

import { Grid, Box, Typography, Avatar, Divider } from "@mui/material";
import { colors } from "@/utils/styles/colors";
import AppButton from "./Button";
import { useRouter } from "next/navigation";
import { clientProfileData } from "@/data/clientProfile";
import { ProfileEducation, ProfileExperience, ProfileReview } from "./specific/Profile";

interface ProfileProps {
  profileInfo: {
    name: string;
    title: string;
    email: string | number;
    location: string;
    description: string;
    module?: string;
    projects?: number | string;
    experience: string | number ;
    availability?: string;
    rate?: string;
    rating?: string;
    visibility?: string;
    weeklyHours?: string; 
    avatar?: string;
    image: string;
  };
  skills: string[];
  experienceList?: string | number| Array<{
    title: string;
    client: string;
    role: string;
    duration: string;
    technologies: string;
  }>; 
  education: string[]; 
  reviews?: Array<{
    client: string;
    rating: number;
    comment: string;
  }>;
}

export const ClientProfile: React.FC<ProfileProps> = ({
  profileInfo,
}: ProfileProps) => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push("/client/profile/updateProfile");
  };

  return (
    <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
      <Grid container columns={12} spacing={8} alignItems="center">
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt="Profile"
            src={profileInfo.image || "/default-avatar.png"}
            sx={{ width: 150, height: 150, mr: 2 }}/>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {clientProfileData.profile.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: 11, mt: 1, maxWidth: 640 }}>
              {clientProfileData.profile.title}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Visibility:{" "}
              <span style={{ fontWeight: 600 }}>
                {clientProfileData.profile.visibility}
              </span>
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container columns={12}>
            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                Module: <strong>{clientProfileData.profile.module}</strong>
              </Typography>
            </Grid>
            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                Projects: <strong>{clientProfileData.profile.projects}</strong>
              </Typography>
            </Grid>

            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13, mt: 1.5 }}>
                Experience: <strong>{clientProfileData.profile.experience}</strong>
              </Typography>
            </Grid>
            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13, mt: 1.5 }}>
                Availability: <strong>{clientProfileData.profile.availability}</strong>
              </Typography>
            </Grid>

            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13, mt: 1.5 }}>
                Rate: <strong>{clientProfileData.profile.rate}</strong>
              </Typography>
            </Grid>
            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13, mt: 1.5 }}>
                Rating: <strong>{clientProfileData.profile.rating}</strong>
              </Typography>
            </Grid>

            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13, mt: 1.5 }}>
                Location: <strong>{clientProfileData.profile.location}</strong>
              </Typography>
            </Grid>
            <Grid sx={{ ml: 28.2, mt: -2.5 }}>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                Contact: <strong>{clientProfileData.profile.contact}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
        <AppButton label="Edit" colorKey="BLUE" width={180} onClick={handleEditClick}/>
        <AppButton label="Delete Account" colorKey="RED" width={180} />
      </Box>
                                        {/* SKILLS & EXPERTISE   */}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Skills & Expertise
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        {clientProfileData.skills.map((skill, index) => (
          <Box
            key={index}
            sx={{border: "1.5px solid #1069f9ff", color: colors.BLUE, px: 2, py: 0.5, fontWeight: 500,
              fontSize: "0.9rem",}}>
            <Typography variant="body2">{skill}</Typography>
          </Box>
        ))}
      </Box>
                                        {/* EXPERIENCE */}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ProfileExperience/>

                                  {/* EDUCATION & CERTIFICATIONS */}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ProfileEducation/>
                                           {/* REVIEW & RATING  */}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ProfileReview/>
    </Box>
  );
};
