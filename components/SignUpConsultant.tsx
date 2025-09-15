'use client';

import * as React from 'react';
import { Box, Container, Typography, Alert} from '@mui/material';
import Image from 'next/image';
import { CreateForm, IFieldConfig } from '@/components/CreateForm';
import { ISignUpForm } from '@/types/auth';
import { FieldValues } from 'react-hook-form';

const SignUpConsultant: React.FC = () => {
    const [error, setError] = React.useState('');

    const elements: IFieldConfig[] = [
        {
            name: "fullName",
            label: "Full Name",
            type: "text",
            rules: { required: "Full Name is required" }
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            rules: {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
            }
        },
        { name: "phone", label: "Phone Number", type: "tel" },
        { name: "password", label: "Password", type: "password", rules: { required: "Password is required" } },
        { name: "confirmPassword", label: "Confirm Password", type: "password", rules: { required: "Confirm Password is required" } },
        { name: "city", label: "City", type: "text" },
        { name: "country", label: "Country", type: "text" },
        {
            name: "cv",
            label: "Upload CV",
            type: "file",
            rules: { required: "CV is required", },
            inputProps: { accept: ".pdf,.doc,.docx" },

        }
    ];

    const handleSuccess = (data: FieldValues) => {
        const formData = data as ISignUpForm;
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        console.log('Consultant signup submitted:', formData);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Image
                        src="/vx9-logo-02.png"
                        alt="SAP Portal Logo"
                        width={0}
                        height={0}
                        style={{ width: '100%', height: 'auto', maxWidth: '120px' }}
                        sizes="(max-width: 600px) 80px, (max-width: 900px) 100px, 150px"
                        priority
                    />
                </Box>

                <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                    Create Consultant Account
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" mb={2}>
                    Sign up to get started
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <CreateForm elements={elements} onSuccess={handleSuccess} />
            </Box>
        </Container>
    );
};

export default SignUpConsultant;
