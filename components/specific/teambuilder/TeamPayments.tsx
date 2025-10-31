import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import {
  teamBuilderPaymentColumns,
  teamBuilderPaymentRows,
  teamBuilderPaymentStats,
  teamBuilderPaymentWiseColumns,
  teamBuilderPaymentWiseRows,
} from "@/data/teamBuilder";
import { APP_ROUTES } from "@/utils/app_routes";
import { Box, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamPayments() {
  const router = useRouter();
  const [paymentType, setPaymentType] = useState("milestone");

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
        mt: 3,
      }}
    >
      <Grid container spacing={2}>
        {" "}
        {teamBuilderPaymentStats.map((s, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            {" "}
            <StatCard {...s} />{" "}
          </Grid>
        ))}{" "}
      </Grid>
      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, textTransform: "capitalize" }}
        >
          Payment (first milestone)
        </Typography>

        <Select
          size="small"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          sx={{
            minWidth: 180,
            bgcolor: "background.paper",
            fontSize: "0.9rem",
          }}
        >
          <MenuItem value="milestone">Pay by Milestone</MenuItem>
          <MenuItem value="module">Pay by Module</MenuItem>
          <MenuItem value="hourly">Pay by Hourly Rate</MenuItem>
        </Select>
      </Box>

      <Box mt={1.5}>
        <DataTable
          title=""
          columns={teamBuilderPaymentColumns}
          rows={teamBuilderPaymentRows}
          pageSize={10}
        />
      </Box>

      <Box mt={3}>
        <DataTable
          title="1st Milestone Payment"
          columns={teamBuilderPaymentWiseColumns}
          rows={teamBuilderPaymentWiseRows}
          pageSize={10}
        />

        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={1.5}
          mt={3}
        >
          <AppButton label="Discard" colorKey="RED" width={180} />
          <AppButton
            label="Start the project"
            colorKey="BLUE"
            width={200}
            onClick={() => router.push(APP_ROUTES.CLIENT.DASHBOARD)}
          />
        </Box>
      </Box>
    </Box>
  );
}
