"use client";

import {
  useClientMeetings,
  useUpdateMeetingStatus,
} from "@/actions/common/useClientMeetings";
import Sidebar from "@/components/Sidebar";
import Interview from "@/components/specific/Interview";
import StatusDropdown from "@/components/StatusDropdown";
import {
  consultantInterviewStats,
  getConsultantInterviewColumns,
} from "@/data/consultantInterview";
import type { ClientInterviewRow, IClientMeetingDTO } from "@/types/client";
import { formatDateTimeAmPm, formatYMD } from "@/utils/dateTime";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export default function ConsultantInterviewPage() {
  const [consultantInterviewRows, setRows] = useState<ClientInterviewRow[]>([]);
  const { mutate: loadMeetings } = useClientMeetings();
  const { mutate: updateStatus } = useUpdateMeetingStatus();

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

  const ConsultantInterviewColumns = getConsultantInterviewColumns.map(
    (col) => {
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
                    onError: (err) =>
                      console.error("Status update failed:", err),
                  }
                );
              }}
            />
          );
        },
      };
    }
  );

  return (
    <Sidebar>
      <Interview
        title="List of Meetings"
        stats={consultantInterviewStats}
        columns={ConsultantInterviewColumns}
        rows={consultantInterviewRows}
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
