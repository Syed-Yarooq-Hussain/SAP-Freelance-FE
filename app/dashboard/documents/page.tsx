"use client";

import { Box, Chip, ChipProps, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const taskColumns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "deadline", headerName: "Deadline", flex: 1 },
    { field: "expirationdate", headerName: "Expiration Date", flex: 1 },
    {
        field: "projectname",
        headerName: "Project Name",
        flex: 1,
        renderCell: (params) => (
            <Typography variant="body1" fontWeight="bold">
                {params.value}
            </Typography>
        ),
    },
    {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => {
            let color: ChipProps["color"] = "default";
            switch (params.value) {
                case "Signed":
                    color = "success";
                    break;
                case "Pending":
                    color = "warning";
                    break;
                case "Rejected":
                    color = "error";
                    break;
            }
            return <Chip label={params.value} color={color} size="small" />;
        },
    },
];

const taskRows = [
    {
        id: 1,
        name: "NDA",
        deadline: "15.09.2025",
        expirationdate: "15.09.2025",
        projectname: "Global Rollout",
        status: "Signed",
    },
    {
        id: 2,
        name: "Service",
        deadline: "15.09.2025",
        expirationdate: "15.09.2025",
        projectname: "Global Rollout",
        status: "Pending",
    },
    {
        id: 3,
        name: "Property ownership",
        deadline: "5.09.2025",
        expirationdate: "15.09.2025",
        projectname: "Global Rollout",
        status: "Rejected",
    },
];

export default function ConsultantDocuments() {
    return (
        <Box>
            <Box
                sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Signed Contract
                </Typography>
                <Box>
                    <DataGrid
                        rows={taskRows}
                        columns={taskColumns}
                        pagination
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10, page: 0 } },
                        }}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>
        </Box>
    );
}
