"use client";

import { Grid, Box, Typography, Avatar, Divider } from "@mui/material";
import { colors } from "@/utils/styles/colors";
import AppButton from "../Button";
import { useRouter } from "next/navigation";
import { clientProfileData } from "@/data/clientProfile";

interface ProfileProps {
  profileInfo: {
    name: string;
    title: string;
    email: string | number;
    location: string;
    description: string;
    module?: string;
    projects?: number | string;
    experience: string | number |  Array<{
      title: string;
      client: string;
      role: string;
      duration: string;
      technologies: string;
  }>;
    availability?: string;
    rate?: string;
    rating?: string;
    visibility?: string;
    weeklyHours?: string; 
    avatar?: string;
    image: string;
  };
  skills: string[];
  experience?: Array<{
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
  skills, 
}: ProfileProps) => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push("/client/profile/updateProfile");
  };

  return (
    <Box
      sx={{border: "1px solid #ddd",borderRadius: 2,p: 3,backgroundColor: "#fff",width: "100%",}}>
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
              {profileInfo.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: 11, mt: 1, maxWidth: 640 }}>
              {profileInfo.title}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Visibility:{" "}
              <span style={{ fontWeight: 600 }}>
                {profileInfo.visibility}
              </span>
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container columns={12}>
            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                Module: <strong>{profileInfo.module}</strong>
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
                Availability: <strong>{profileInfo.availability}</strong>
              </Typography>
            </Grid>

            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13, mt: 1.5 }}>
                Rate: <strong>{profileInfo.rate}</strong>
              </Typography>
            </Grid>
            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13, mt: 1.5 }}>
                Rating: <strong>{clientProfileData.profile.rating}</strong>
              </Typography>
            </Grid>

            <Grid size={{ xs: 8, md: 6 }}>
              <Typography variant="body2" sx={{ fontSize: 13, mt: 1.5 }}>
                Location: <strong>{profileInfo.location}</strong>
              </Typography>
            </Grid>
            <Grid sx={{ ml: 28.2, mt: -2.5 }}>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                Contact: <strong>{profileInfo.email}</strong>
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
        {skills.map((skill, index) => (
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        Experience
      </Typography>
     <Grid sx={{ mb: 3,}}>         
          <Grid container spacing={2}>
            {clientProfileData.experience.map((exp , i: number) => (
              <Grid size={{ xs:12, md:4}} key={i}>
                <Box
                  sx={{
                    borderLeft: "3px solid #f50057",
                    p: 2,
                  }}
                >
                  <Typography sx={{fontWeight:600, fontSize:16}}>{exp.title}</Typography>
                  <Typography sx={{fontWeight:500,mt:1, fontSize:13}}>
                    Client:<b> {exp.client}</b>
                  </Typography>
                  <Typography sx={{fontWeight:500,mt:1, fontSize:13}}>
                    Role:<b> {exp.role} </b>
                  </Typography>
                  <Typography sx={{fontWeight:500,mt:1, fontSize:13}}>
                    Duration:<b> {exp.duration}</b>
                  </Typography>
                  <Typography sx={{fontWeight:500,mt:1, fontSize:13}}>
                    Technologies: <b> {exp.technologies}</b>
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
      </Grid>

                                  {/* EDUCATION & CERTIFICATIONS */}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Education & Certifications
      </Typography>
      <Grid sx={{fontWeight:600,ml:-2}}>
      <ul>
        {clientProfileData.education.map((edu, index) => (
          <li key={index}>{edu}</li>
        ))}
      </ul>
      </Grid>
                                           {/* REVIEW & RATING  */}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        Reviews & Ratings
      </Typography>
      <Grid container spacing={4}>
        {clientProfileData.reviews.map((rev, index) => (
          <Grid
            key={index}
            size={{ xs: 12, md: 4 }}
            sx={{borderLeft: "3px solid #4985eeff",height: "6.5rem",pl: 2,}}>
            <Typography
              variant="body2"
              sx={{ color: "gray", marginTop: 2, marginBottom: 0.5 }}
            >
              Client: <span style={{ fontWeight: 600, color: "black" }}>{rev.client}</span>
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "gray", marginBottom: 0.5 }}
            >
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
};
