"use client";

export default function ClientDashboard() {
    return (
        <main style={{ padding: "10px" }}>
            {/* <Box mb={3}>
        <DashboardStats />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2, mb: 2 }}>
            <VisibilityChart />
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Interviews
            </Typography>
            <Box>
              <DataGrid
                rows={interviewRows}
                columns={interviewColumns}
                hideFooterPagination
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#0066ffff",
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>
            <Box textAlign="center" mt={1}>
              <Button size="small">View more</Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Tasks
            </Typography>
            <Box>
              <DataGrid
                rows={taskRows}
                columns={taskColumns}
                hideFooterPagination
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
              />
            </Box>
            <Box textAlign="center" mt={1}>
              <Button size="small">View more</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <SidebarInfo />
        </Grid>
      </Grid> */}
        </main>
    );
}
