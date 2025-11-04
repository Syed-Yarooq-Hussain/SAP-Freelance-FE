"use client";

import { Box, MenuItem, Select, Typography } from "@mui/material";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartOptions: ApexOptions = {
  chart: {
    type: "area",
    height: 320,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: { style: { colors: "#777", fontSize: "12px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { colors: "#777", fontSize: "12px" } },
  },
  fill: {
    type: "solid",
    opacity: 0.5,
  },
  colors: ["#FF8F6DCC", "#DBA5FF"],
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    markers: {
      size: 5,
      shape: "circle",
    },
    labels: { colors: "#333" },
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "#f1f1f1",
    strokeDashArray: 3,
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
};

const initialSeries = [
  {
    name: "Consultant",
    data: [30, 20, 40, 35, 60, 95, 30, 45, 65, 70, 80, 40],
  },
  {
    name: "Clients",
    data: [20, 35, 25, 45, 35, 65, 50, 55, 60, 50, 90, 30],
  },
];

const VisibilityChart = () => {
  const [series] = useState(initialSeries);
  const [filter, setFilter] = useState("Yearly");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Performance
        </Typography>

        <Select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{
            minWidth: 120,
            fontSize: "0.9rem",
            bgcolor: "background.paper",
          }}
        >
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Quarterly">Quarterly</MenuItem>
          <MenuItem value="Yearly">Yearly</MenuItem>
        </Select>
      </Box>

      <ApexChart
        options={chartOptions}
        series={series}
        type="area"
        height={320}
      />
    </Box>
  );
};

export default VisibilityChart;
