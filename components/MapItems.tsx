'use client';

import React from 'react';
import Grid from '@mui/material/Grid';

type GridSize = {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
};

type CardItem = {
    key: React.Key;
    component: React.ReactNode;
    grid?: GridSize;
};

type MapItemsProps = {
    items: CardItem[];
    spacing?: number;
};

export default function MapItems({ items, spacing = 3 }: MapItemsProps) {
    return (
        <Grid container spacing={spacing} alignItems="stretch">
            {items.map(({ key, component, grid }) => (
                <Grid
                    key={key}
                    size={grid}
                    sx={{ display: 'flex' }}
                >
                    {component}
                </Grid>
            ))}
        </Grid>
    );
}
