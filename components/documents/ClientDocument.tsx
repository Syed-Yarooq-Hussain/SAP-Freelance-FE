"use client";

import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

const taskColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 2 },
  { field: "deadline", headerName: "Deadline", flex: 2 },
  { field: "expirationDate", headerName: "Expiration Date", flex: 2 },
  { field: "projects", headerName: "Projects", flex: 1 },
  { field: "used", headerName: "Used", flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: () => (
      <Stack direction="row" spacing={1}>
        <EditIcon color="primary" fontSize="small" />
        <DeleteIcon color="error" fontSize="small" />
      </Stack>
    ),
  },
];

const taskRows = [
  {
    id: 1,
    name: "NDA",
    deadline: "15.09.2028",
    expirationDate: "15.09.2028",
    projects: 5,
    used: 50,
  },
  {
    id: 2,
    name: "Service",
    deadline: "15.09.2028",
    expirationDate: "15.09.2028",
    projects: 5,
    used: 50,
  },
  {
    id: 3,
    name: "Property ownership",
    deadline: "15.09.2028",
    expirationDate: "15.09.2028",
    projects: 5,
    used: 50,
  },
  {
    id: 4,
    name: "Project contract",
    deadline: "15.09.2028",
    expirationDate: "15.09.2028",
    projects: 5,
    used: 50,
  },
];

export default function ClientDocuments() {
  const [openPopup, setOpenPopup] = useState(false);

  const handleUploadClick = () => setOpenPopup(true);
  const handleClosePopup = () => setOpenPopup(false);
  const handleSubmitUpload = () => {
    console.log("File uploaded!");
    setOpenPopup(false);
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Contract
        </Typography>

        <Stack direction="row" spacing={2}>
          <AppButton
            label="Upload"
            colorKey="GREEN"
            onClick={handleUploadClick}
          />
          <AppButton label="Create" colorKey="BLUE" />
        </Stack>
      </Box>

      <DataTable title="" columns={taskColumns} rows={taskRows} pageSize={10} />

      <DynamicPopup
        open={openPopup}
        onClose={handleClosePopup}
        title="Upload Document"
        fileUpload={true}
        buttonText="Save"
        buttonColor="BLUE"
        onSubmit={handleSubmitUpload}
      />
    </Box>
  );
}
