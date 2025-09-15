'use client';

import * as React from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import Image from 'next/image';
import { CreateForm, IFieldConfig } from '@/components/CreateForm';
import { ISignUpForm } from '@/types/auth';
import { FieldValues } from 'react-hook-form';

interface ISignUpClientForm extends ISignUpForm {
    companyName: string;
}

const SignUpClient: React.FC = () => {
    const [error, setError] = React.useState('');

    const elements: IFieldConfig[] = [
        { name: 'fullName', label: 'Full Name', placeholder: 'Enter full name', rules: { required: 'Full name is required' } },
        { name: 'companyName', label: 'Company Name', placeholder: 'Enter company name' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email', rules: { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } } },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', rules: { required: 'Phone is required', pattern: { value: /^[0-9]{10,15}$/, message: 'Invalid phone number format' } } },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password', rules: { required: 'Password is required', minLength: { value: 6, message: 'At least 6 chars' } }, column: { xs: 12, sm: 6 } },
        { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Confirm password', rules: { required: 'Confirm your password' }, column: { xs: 12, sm: 6 } },
        { name: 'city', label: 'City', placeholder: 'Enter city', rules: { required: 'City is required' }, column: { xs: 12, sm: 6 } },
        { name: 'country', label: 'Country', placeholder: 'Enter country', rules: { required: 'Country is required' }, column: { xs: 12, sm: 6 } },
    ];

    const handleSuccess = (data: FieldValues) => {
        const formData = data as ISignUpClientForm;
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        console.log('Client signup submitted:', formData);
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
                    Create Client Account
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

export default SignUpClient;
