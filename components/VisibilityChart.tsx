"use client";

import dynamic from "next/dynamic";
import {
  Box,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { ApexOptions } from "apexcharts";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartOptions: ApexOptions = {
  chart: {
    type: "line",
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
  },
  markers: {
    size: 4,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
};

const initialSeries = [
  {
    name: "Visibility",
    data: [40, 60, 50, 70, 60, 90, 50, 60, 70, 90, 80, 50],
  },
  {
    name: "Profile views",
    data: [30, 50, 40, 60, 70, 100, 60, 70, 60, 80, 60, 40],
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
          Visibility
        </Typography>
        <Select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Quarterly">Quarterly</MenuItem>
          <MenuItem value="Yearly">Yearly</MenuItem>
        </Select>
      </Box>

      <ApexChart
        options={chartOptions}
        series={series}
        type="line"
        height={320}
      />
    </Box>
  );
};

export default VisibilityChart;
