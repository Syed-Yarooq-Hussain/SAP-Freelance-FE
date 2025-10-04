"use client";

import AppButton from "@/components/Button";
import { Roles } from "@/constants/roles";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "92vh",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Image
              src="/vx9-logo-02.png"
              alt="SAP Portal Logo"
              width={0}
              height={0}
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "150px",
              }}
              sizes="(max-width: 600px) 80px,
                     (max-width: 900px) 120px,
                     150px"
              priority
            />
          </Box>

          <Typography variant="h4" fontWeight="bold">
            Welcome to SAP Portal
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Continue as
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 1, width: "100%" }}
          >
            <AppButton
              label="CLIENT"
              color="primary"
              size="large"
              sx={{ flex: 1, fontWeight: "bold" }}
              onClick={() => router.push(`/auth/signup?type=${Roles.CLIENT}`)}
            />
            <AppButton
              variant="outlined"
              label="CONSULTANT"
              color="primary"
              size="large"
              fontColor="primary"
              sx={{ flex: 1, fontWeight: "bold" }}
              onClick={() =>
                router.push(`/auth/signup?type=${Roles.CONSULTANT}`)
              }
            />
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
