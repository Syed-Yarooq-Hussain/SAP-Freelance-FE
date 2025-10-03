"use client";

import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { FC } from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: FC<SectionProps> = ({ title, children }) => (
  <Card
    sx={{
      mb: 2,
      borderRadius: 2,
      boxShadow: 1,
      bgcolor: "#ffffffff",
    }}
  >
    <CardContent>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "text.primary" }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {children}
    </CardContent>
  </Card>
);

const SidebarInfo: FC = () => {
  return (
    <Box display="flex" flexDirection="column">
      <Section title="Skills & Certifications">
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Primary SAP modules
          </Typography>
          <Typography variant="subtitle2" fontWeight="bold">
            SAP FI, SAP S/4HANA
          </Typography>
          <Typography variant="body2" color="text.secondary">
            4 year experience
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box>
          <Typography variant="body2" color="text.secondary">
            Technical skills
          </Typography>
          <Typography variant="subtitle2" fontWeight="bold">
            ABAP, Fiori
          </Typography>
          <Typography variant="body2" color="text.secondary">
            4 year experience
          </Typography>
        </Box>
      </Section>

      <Section title="Engagement">
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Current Employer
          </Typography>
          <Typography variant="subtitle2" fontWeight="bold">
            Global Rollout
          </Typography>
          <Typography variant="body2" color="text.secondary">
            14 months – lead consultant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            SAP SD, S/4HANA
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box>
          <Typography variant="body2" color="text.secondary">
            Upcoming Employer
          </Typography>
          <Typography variant="subtitle2" fontWeight="bold">
            Rental Co.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            6 months – SD Team lead
          </Typography>
          <Typography variant="body2" color="text.secondary">
            SAP SD, Fiori
          </Typography>
        </Box>
      </Section>

      <Section title="System Alert">
        <Box mb={1}>
          <Typography variant="body2" color="text.primary">
            Interview invite from RetailCo – 02-Aug
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Profile approved by Admin
          </Typography>
        </Box>
      </Section>
    </Box>
  );
};

export default SidebarInfo;
