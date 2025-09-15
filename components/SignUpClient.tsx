'use client';

import * as React from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Typography,
    Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useForm, Controller } from 'react-hook-form';
import FormController from '@/components/FormController';
import { ISignUpForm } from '@/types/auth';
import Image from 'next/image';

interface ISignUpClientForm extends ISignUpForm {
    companyName: string;
}

const SignUpClient: React.FC = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ISignUpClientForm>({
        defaultValues: {
            fullName: '',
            companyName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            city: '',
            country: '',
            module: '',
            level: '',
            experience: 0,
            rate: 0,
            availableHours: 0,
            termsAccepted: false,
        },
    });

    const [error, setError] = React.useState('');

    const onSubmit = (data: ISignUpClientForm) => {
        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!data.termsAccepted) {
            setError('You must accept the Terms & Conditions.');
            return;
        }
        setError('');
        console.log('Form Submitted:', data);
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: 'background.paper',
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
                            maxWidth: '120px',
                        }}
                        sizes="(max-width: 600px) 80px, 
                   (max-width: 900px) 100px, 
                   150px"
                        priority
                    />
                </Box>

                <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                    Create Client Account
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" mb={2}>
                    Sign up to get started
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <FormController<ISignUpClientForm>
                        name="fullName"
                        control={control}
                        errors={errors}
                        label="Full Name"
                        rules={{ required: 'Full Name is required' }}
                    />
                    <FormController<ISignUpClientForm>
                        name="companyName"
                        control={control}
                        errors={errors}
                        label="Company Name"
                    />
                    <FormController<ISignUpClientForm>
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
                    <FormController<ISignUpClientForm>
                        name="phone"
                        control={control}
                        errors={errors}
                        label="Phone Number"
                        type="tel"
                        rules={{
                            required: 'Phone number is required',
                            pattern: { value: /^[0-9]{10,15}$/, message: 'Invalid phone number format' },
                        }}
                    />

                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <FormController<ISignUpClientForm>
                                name="password"
                                control={control}
                                errors={errors}
                                label="Password"
                                type="password"
                                rules={{ required: 'Password is required', minLength: 6 }}
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormController<ISignUpClientForm>
                                name="confirmPassword"
                                control={control}
                                errors={errors}
                                label="Confirm Password"
                                type="password"
                                rules={{ required: 'Confirm your password' }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <FormController<ISignUpClientForm>
                                name="city"
                                control={control}
                                errors={errors}
                                label="City"
                                rules={{ required: 'City is required' }}
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormController<ISignUpClientForm>
                                name="country"
                                control={control}
                                errors={errors}
                                label="Country"
                                rules={{ required: 'Country is required' }}
                            />
                        </Grid>
                    </Grid>

                    <Controller
                        name="termsAccepted"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} checked={field.value} />}
                                label={
                                    <Typography variant="body2">
                                        I agree to the <a href="#">Terms of Service</a> and{' '}
                                        <a href="#">Privacy Policy</a>
                                    </Typography>
                                }
                                sx={{ mt: 2 }}
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
                    >
                        Create Account
                    </Button>

                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account? <a href="/auth/login">Sign in</a>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUpClient;
