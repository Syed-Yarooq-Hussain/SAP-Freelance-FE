"use client";

import {
    Box,
    Card,
    CardContent,
    Divider,
    Typography,
} from "@mui/material";
import { FC } from "react";

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

const Section: FC<SectionProps> = ({ title, children }) => (
    <Card
        sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: 1,
            bgcolor: "#ffffffff",
        }}
    >
        <CardContent>
            <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "text.primary" }}
            >
                {title}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {children}
        </CardContent>
    </Card>
);

const SidebarInfo: FC = () => {
    return (
        <Box display="flex" flexDirection="column">
            <Section title="Engagement">
                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                        Current Employer
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                        Global Rollout
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        14 months – lead consultant
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        SAP SD, S/4HANA
                    </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Upcoming Employer
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                        Rental Co.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        6 months – SD Team lead
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        SAP SD, Fiori
                    </Typography>
                </Box>
            </Section>

            <Section title="Education">
                <Box mb={1}>
                    <Typography variant="body2" color="text.primary">
                        SAP Certified Application Associate – SAP S/4HANA Sales
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        MSc, Technical University Munich
                    </Typography>
                </Box>
            </Section>

            <Section title="Payment Logs">
                <Box mb={2} display="flex" justifyContent="space-between">
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            #INV-001
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                            $2,500
                        </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium" color="success.main">
                        Paid
                    </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            #INV-002
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                            $1,800
                        </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium" color="warning.main">
                        Pending
                    </Typography>
                </Box>
            </Section>

            <Section title="System Alert">
                <Box mb={1}>
                    <Typography variant="body2" color="text.primary">
                        Interview invite from RetailCo – 02-Aug
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Profile approved by Admin
                    </Typography>
                </Box>
            </Section>
        </Box>
    );
};

export default SidebarInfo;
