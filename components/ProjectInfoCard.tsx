"use client";

import { Box, Button, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface ProjectInfoCardProps {
    projectName: string;
    category?: string;
    actionLabel?: string;
    onActionClick?: () => void;
    extraContent?: ReactNode;
}

const ProjectInfoCard: FC<ProjectInfoCardProps> = ({
    projectName,
    category,
    actionLabel,
    onActionClick,
    extraContent,
}) => {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #FFB64E"
            }}
        >
            <Box>
                <Typography variant="subtitle2" color="text.secondary">
                    Project name
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        {projectName}
                    </Typography>
                    {category && (
                        <Typography variant="body2" color="text.secondary">
                            {category}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box>
                {actionLabel && (
                    <Button
                        size="small"
                        variant="text"
                        color="primary"
                        onClick={onActionClick}
                    >
                        {actionLabel}
                    </Button>
                )}
                {extraContent}
            </Box>
        </Box>
    );
};

export default ProjectInfoCard;
