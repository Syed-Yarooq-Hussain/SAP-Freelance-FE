"use client";

import { ProfileData } from "@/types/profile";
import { Box, Grid, Typography } from "@mui/material";
import EmptyState from "./EmptyStats";

interface Props {
  reviews: ProfileData["reviews"];
}

const ProfileReviewsSection = ({ reviews }: Props) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mt={4} mb={3}>
        Reviews &amp; Ratings
      </Typography>

      {reviews.length === 0 ? (
        <EmptyState text="No reviews &amp; ratings available" />
      ) : (
        <Grid container spacing={4}>
          {reviews.map((rev, i) => (
            <Grid
              key={i}
              size={{ xs: 12, md: 4 }}
              sx={{
                borderLeft: "3px solid #4985eeff",
                height: "6.5rem",
                pl: 2,
              }}
            >
              <Typography variant="body2" color="grey">
                Client: <b>{rev.client}</b>
              </Typography>
              <Typography variant="body2" color="grey">
                Rating: <b>{rev.rating}</b>
              </Typography>
              <Typography variant="body2">{rev.comment}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProfileReviewsSection;
