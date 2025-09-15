'use client';

import * as React from 'react';
import { Box, Button, Container, Typography, Stack, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Roles } from '@/constants/roles';

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Image
              src="/vx9-logo-02.png"
              alt="SAP Portal Logo"
              width={0}
              height={0}
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '150px',
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
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 1, width: '100%' }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{ flex: 1, fontWeight: 'bold' }}
              onClick={() => router.push(`/auth/signup?type=${Roles.CLIENT}`)}
            >
              Client
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ flex: 1, fontWeight: 'bold' }}
              onClick={() => router.push(`/auth/signup?type=${Roles.CONSULTANT}`)}
            >
              Consultant
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
