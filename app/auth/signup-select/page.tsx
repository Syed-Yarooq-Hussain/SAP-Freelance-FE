"use client";

import AppButton from "@/components/Button";
import { Roles } from "@/constants/roles";
import { APP_ROUTES } from "@/utils/app_routes";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Roles | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    router.push(`${APP_ROUTES.SIGNUP}?type=${selectedRole}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        bgcolor: "#f7f9fc",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            textAlign: "center",
            borderRadius: 3,
            px: 4,
            py: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Image
              src="/images/logo-c.png"
              alt="Vertex9 Systems"
              width={140}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </Box>

          <Typography variant="h5" fontWeight="bold" mt={1}>
            Join Vertex9
          </Typography>

          <Typography variant="body1" color="text.secondary" mt={1} mb={3}>
            Select how you’d like to join our platform
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ width: "100%", mb: 4 }}
          >
            <Box
              onClick={() => setSelectedRole(Roles.CLIENT)}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                border: "1px solid #d7dce3",
                cursor: "pointer",
                transition: "0.25s",
                boxShadow:
                  selectedRole === Roles.CLIENT
                    ? "0px 0px 8px #bcd5ff"
                    : "none",
                background: selectedRole === Roles.CLIENT ? "#eef5ff" : "white",
                "&:hover": { background: "#f3f7ff" },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  background: "linear-gradient(180deg, #4d8cff, #0056d6 90%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                }}
              >
                <BusinessIcon sx={{ color: "white", fontSize: 32 }} />
              </Box>

              <Typography fontWeight="bold" mt={2}>
                I’m a Client
              </Typography>

              <Typography fontSize="0.85rem" color="text.secondary" mt={1}>
                Looking to hire consultants for my projects
              </Typography>
            </Box>

            <Box
              onClick={() => setSelectedRole(Roles.CONSULTANT)}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                border: "1px solid #d7dce3",
                cursor: "pointer",
                transition: "0.25s",
                boxShadow:
                  selectedRole === Roles.CONSULTANT
                    ? "0px 0px 8px #e3b2ff"
                    : "none",
                background:
                  selectedRole === Roles.CONSULTANT ? "#fcf3ff" : "white",
                "&:hover": { background: "#fbf5ff" },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  background: "linear-gradient(180deg, #d75aff, #a300d6 90%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                }}
              >
                <PersonIcon sx={{ color: "white", fontSize: 32 }} />
              </Box>

              <Typography fontWeight="bold" mt={2}>
                I’m a Consultant
              </Typography>

              <Typography fontSize="0.85rem" color="text.secondary" mt={1}>
                Looking to find SAP consulting opportunities
              </Typography>
            </Box>
          </Stack>

          <AppButton
            label="✓ Complete Sign Up"
            colorKey="BLUE"
            disabled={!selectedRole}
            onClick={handleContinue}
            width="100%"
            sx={{
              py: 1.2,
              bgcolor: selectedRole ? "#4d8cff" : "#d3d7de",
            }}
          />

          <Typography
            variant="caption"
            sx={{ display: "block", mt: 2, color: "text.secondary" }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
