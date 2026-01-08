"use client";

import { useClientStats } from "@/actions/clients/useClientStats";
import {
  useClientMeetings,
  useUpdateMeetingStatus,
} from "@/actions/common/useClientMeetings";
import Sidebar from "@/components/Sidebar";
import Interview from "@/components/specific/Interview";
import StatusDropdown from "@/components/StatusDropdown";
import {
  clientInterviewColumns,
  clientInterviewStats,
} from "@/data/clientInterview";
import type { ClientInterviewRow, IClientMeetingDTO } from "@/types/client";
import { formatDateTimeAmPm, formatYMD } from "@/utils/dateTime";
import { useAnimatedCounter } from "@/utils/useAnimatedCounter";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export default function ClientInterviewPage() {
  const [rows, setRows] = useState<ClientInterviewRow[]>([]);
  const { mutate: loadMeetings } = useClientMeetings();
  const { mutate: updateStatus } = useUpdateMeetingStatus();
  const { data: statsRes, isLoading: statsLoading } = useClientStats();
  const meetingStats = statsRes?.data?.meetings_stats;

  const animatedStats = [
    useAnimatedCounter(meetingStats?.interview_requests ?? 0),
    useAnimatedCounter(meetingStats?.upcoming_interviews ?? 0),
    useAnimatedCounter(meetingStats?.rescheduled_interviews ?? 0),
    useAnimatedCounter(meetingStats?.cancelled_interviews ?? 0),
  ];

  const stats = clientInterviewStats.map((stat, index) => ({
    ...stat,
    subtitle: animatedStats[index],
    loading: statsLoading,
  }));

  useEffect(() => {
    loadMeetings(undefined, {
      onSuccess: (res) => {
        const mapped: ClientInterviewRow[] =
          res.data?.map((item: IClientMeetingDTO) => ({
            id: Number(item.id),
            consultant: item.invitees_names ?? "N/A",
            projectname: item.project_name ?? "N/A",
            requestDate: formatYMD(item.created_at),
            datetime: formatDateTimeAmPm(item.date_time),
            duration: item.duration ? `${item.duration} mins` : "-",
            status: item.status ?? "Pending",
          })) ?? [];

        setRows(mapped);
      },
      onError: (err) => console.error(err),
    });
  }, [loadMeetings]);

  const enhancedColumns = clientInterviewColumns.map((col) => {
    if (col.field !== "status") return col;

    return {
      ...col,
      renderCell: (params: GridRenderCellParams<ClientInterviewRow>) => {
        const meetingId = params.row.id;

        return (
          <StatusDropdown
            value={params.value}
            onChange={(newStatus) => {
              updateStatus(
                { meetingId, status: newStatus },
                {
                  onSuccess: () => {
                    setRows((prev) =>
                      prev.map((r) =>
                        r.id === meetingId ? { ...r, status: newStatus } : r
                      )
                    );
                  },
                  onError: (err) => console.error("Status update failed:", err),
                }
              );
            }}
          />
        );
      },
    };
  });

  return (
    <Sidebar>
      <Interview
        title="Meetings"
        stats={stats}
        columns={enhancedColumns}
        rows={rows}
        rescheduleEnabled
        onRefresh={() => {
          loadMeetings(undefined, {
            onSuccess: (res) => {
              const mapped: ClientInterviewRow[] =
                res.data?.map((item: IClientMeetingDTO) => ({
                  id: Number(item.id),
                  consultant: item.invitees_names ?? "N/A",
                  projectname: item.project_name ?? "N/A",
                  requestDate: formatYMD(item.created_at),
                  datetime: formatDateTimeAmPm(item.date_time),
                  duration: item.duration ? `${item.duration} mins` : "-",
                  status: item.status ?? "Pending",
                })) ?? [];

              setRows(mapped);
            },
          });
        }}
      />
    </Sidebar>
  );
}
