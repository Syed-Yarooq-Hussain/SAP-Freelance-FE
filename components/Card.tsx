'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Box,
} from '@mui/material';
import AppButton from '@/components/Button';

type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
};

export default function DashboardCard({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: DashboardCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0px 6px 20px rgba(0,0,0,0.15)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'left',
          pt: 2,
          pl: 2,
          color: 'primary.main',
          '& .MuiSvgIcon-root': {
            fontSize: 30,
          },
        }}
      >
        {icon}
      </CardMedia>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 2 }}>
        <AppButton label={buttonText} onClick={onClick} />
      </CardActions>
    </Card>
  );
}
