'use client';

import * as React from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import FormController from '@/components/FormController';
import Link from 'next/link';

interface ILoginForm {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ILoginForm>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [error, setError] = React.useState('');

    const onSubmit = (data: ILoginForm) => {
        setError('');
        console.log('Login Submitted:', data);
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

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <FormController<ILoginForm>
                        name="email"
                        control={control}
                        errors={errors}
                        label="Email"
                        type="email"
                        rules={{
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
                        }}
                    />

                    <FormController<ILoginForm>
                        name="password"
                        control={control}
                        errors={errors}
                        label="Password"
                        type="password"
                        rules={{ required: 'Password is required' }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
                    >
                        Sign in
                    </Button>
                </Box>
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
