import { clientProfileData } from "@/data/clientProfile"
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { usePathname } from "next/navigation";

export const ProfileExperience = () => {
const pathname = usePathname();

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Experience
          </Typography>
            <Grid sx={{ mb: 3,}}>         
              <Grid container spacing={2}>
                {clientProfileData.experienceList.map((exp , i: number) => (
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
                 {pathname === "/client/profile/updateProfile" && (
                  <Stack direction="row" marginTop={1}>
                    <IconButton size="small"><BorderColorIcon sx={{ color: "#4b75f2", fontSize: 20 }} /></IconButton>
                    <IconButton size="small"><DeleteForeverIcon sx={{ color: "#f44336", fontSize: 20 }}/></IconButton>
                  </Stack>     
                )}
                    </Box>
                  </Grid>
                ))}
              </Grid> 
          </Grid> 
         </Box> 
  )
} 
export const ProfileEducation = () => {
const pathname = usePathname();

    return (
        <Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Education & Certifications
          </Typography>
         <Grid sx={{ fontWeight: 600, ml: -2 }}>
    
          <ul style={{ listStyleType: "disc", paddingLeft: 40, margin: 0 }}>
            {clientProfileData.education.map((edu, index) => (
              <li key={index} style={{ marginBottom: "6px" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                  <Typography component="span" sx={{ fontWeight: 600 }}>{edu}</Typography>
                {pathname === "/client/profile/updateProfile" && (
                  <Stack direction="row">
                    <IconButton size="small"><DeleteForeverIcon sx={{ color: "#4b75f2", fontSize: 20 }} /></IconButton>
                    <IconButton size="small"><BorderColorIcon sx={{ color: "#f44336", fontSize: 20 }}/></IconButton>
                  </Stack>
                )}
                </Stack>
              </li>
            ))}
          </ul>
        </Grid>
        </Box>
    )
} 
export const ProfileReview = () => {
    return (
        <Box>
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
    )
}