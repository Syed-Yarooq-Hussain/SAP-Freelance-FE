'use client';

import * as React from 'react';
import MuiButton, { ButtonProps } from '@mui/material/Button';

interface IAppButtonProps extends ButtonProps {
    label: string;
};

const AppButton: React.FC<IAppButtonProps> = ({ label, ...props }) => {
    return (
        <MuiButton
            variant={props.variant || 'contained'}
            color={props.color || 'primary'}
            size="small"
            onClick={props.onClick}
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


export default AppButton;