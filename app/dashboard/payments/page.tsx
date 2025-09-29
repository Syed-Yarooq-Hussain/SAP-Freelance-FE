"use client";

import { Box, Button, Chip, ChipProps, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const taskColumns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "duedates", headerName: "Due Dates", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => {
            let color: ChipProps["color"] = "default";
            switch (params.value) {
                case "Paid":
                    color = "success";
                    break;
                case "Pending":
                    color = "warning";
                    break;
                case "OverDue":
                    color = "error";
                    break;
            }
            return <Chip label={params.value} color={color} size="small" />;
        },
    },
    {
        field: "invoice",
        headerName: "Invoice",
        flex: 1,
        renderCell: () => (
            <Button variant="contained" color="primary" size="small">
                Download
            </Button>
        ),
    },
];

const taskRows = [
    {
        id: 1,
        name: "January Fees",
        duedates: "15.09.2025",
        amount: "2,500 USD",
        status: "Paid",
        invoice: "download-link-1",
    },
    {
        id: 2,
        name: "February Fees",
        duedates: "15.09.2025",
        amount: "3,500 USD",
        status: "Pending",
        invoice: "download-link-2",
    },
    {
        id: 3,
        name: "March Fees",
        duedates: "5.09.2025",
        amount: "3,500 USD",
        status: "OverDue",
        invoice: "download-link-3",
    },
];

export default function ConsultantPayments() {
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
                    Payment
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
