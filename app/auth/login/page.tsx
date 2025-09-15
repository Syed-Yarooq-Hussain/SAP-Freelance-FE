'use client';

import * as React from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { CreateForm, IFieldConfig } from '@/components/CreateForm';
import { FieldValues } from 'react-hook-form';

interface ILoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [error, setError] = React.useState('');

  const elements: IFieldConfig[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      rules: {
        required: 'Email is required',
        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      rules: { required: 'Password is required' },
    },
  ];

  const handleSuccess = (data: FieldValues) => {
    setError('');
    console.log('Login Submitted:', data as ILoginForm);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper',
          textAlign: 'center',
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

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Please sign in to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <CreateForm elements={elements} onSuccess={handleSuccess} />

      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don’t have an account?{' '}
        <Link href="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
          Sign up
        </Link>
      </Typography>
    </Container>
  );
};

export default LoginPage;
