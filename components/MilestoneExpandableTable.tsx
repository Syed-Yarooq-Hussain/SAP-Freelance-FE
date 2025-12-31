"use client";

import DataTable from "@/components/DataTable";
import { taskColumns } from "@/data/teamBuilder";
import type { MilestoneRow, TaskRow } from "@/types/teamBuilder";
import { colors } from "@/utils/styles/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

interface Props {
  milestones: MilestoneRow[];
  tasksByMilestone: Record<number, TaskRow[]>;
  expandedMilestoneId: number | null;
  onExpand: (milestoneId: number | null) => void;
  onEditTask: (task: TaskRow) => void;
  onEditMilestone: (milestone: MilestoneRow) => void;
  onDeleteMilestone?: (milestone: MilestoneRow) => void;
  taskForm: React.ReactNode;
}

export default function MilestoneExpandableTable({
  milestones,
  tasksByMilestone,
  expandedMilestoneId,
  onExpand,
  onEditTask,
  onEditMilestone,
  onDeleteMilestone,
  taskForm,
}: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
              Name
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
              Start Date
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
              End Date
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
              Description
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
              Tasks
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {milestones.map((m) => {
            const isOpen = expandedMilestoneId === m.id;

            return (
              <React.Fragment key={m.id}>
                <TableRow>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.start_date}</TableCell>
                  <TableCell>{m.due_date}</TableCell>
                  <TableCell>{m.description}</TableCell>

                  <TableCell>
                    <Box
                      onClick={() => onExpand(isOpen ? null : m.id)}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        cursor: "pointer",
                        color: colors.BLUE,
                        fontWeight: 600,
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {isOpen ? (
                        <KeyboardArrowUpIcon fontSize="small" />
                      ) : (
                        <KeyboardArrowDownIcon fontSize="small" />
                      )}
                      {m.tasks}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => onEditMilestone(m)}
                          sx={{
                            color: colors.BLUE,
                            "&:hover": { bgcolor: `${colors.BLUE}15` },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => onDeleteMilestone?.(m)}
                          sx={{
                            color: colors.RED,
                            "&:hover": { bgcolor: `${colors.RED}15` },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={6} sx={{ p: 0 }}>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, bgcolor: "#FFFAF3" }}>
                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                          Tasks for{" "}
                          <span style={{ color: colors.BLUE }}>{m.name}</span>
                        </Typography>

                        <DataTable<TaskRow>
                          title=""
                          rows={tasksByMilestone[m.id] || []}
                          columns={taskColumns(onEditTask)}
                          pageSize={5}
                          hidePagination
                        />

                        <Box mt={2}>{taskForm}</Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
