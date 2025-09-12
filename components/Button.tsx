'use client';

import * as React from 'react';
import MuiButton from '@mui/material/Button';

type AppButtonProps = {
    label: string;
    onClick: () => void;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
};

export default function AppButton({
    label,
    onClick,
    variant = 'contained',
    color = 'primary',
}: AppButtonProps) {
    return (
        <MuiButton
            variant={variant}
            color={color}
            size="small"
            onClick={onClick}
            sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 0.5,
                fontWeight: 'bold',
            }}
        >
            {label}
        </MuiButton>
    );
}
