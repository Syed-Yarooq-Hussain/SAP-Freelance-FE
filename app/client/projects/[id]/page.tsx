"use client";

import { useCreateMilestone } from "@/actions/projects/useCreateMilestone";
import { useProjectDetails } from "@/actions/projects/useGetProjectDetails";
import { useGetProjectMilestones } from "@/actions/projects/useGetProjectMilestones";
import { useUpdateMilestone } from "@/actions/projects/useUpdateMilestone";
import AppButton from "@/components/Button";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import Sidebar from "@/components/Sidebar";
import ProjectDetailsLayout from "@/components/specific/ProjectDetailsLayout";
import { milestoneColumns, teamMembers } from "@/data/clientProjectDetails";
import { getMilestoneFormFields } from "@/forms/milestoneForm";
import { ProjectInfoData } from "@/types/projects";
import type { ClientMilestoneRow, IMilestone } from "@/types/teamBuilder";
import { APP_ROUTES } from "@/utils/app_routes";
import { formatYMD } from "@/utils/dateTime";
import { mapMilestoneFieldsToPopup } from "@/utils/mapFormToPopup";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ClientProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const [milestones, setMilestones] = useState<ClientMilestoneRow[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const { mutate: createMilestone } = useCreateMilestone();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateMilestone } = useUpdateMilestone();
  const [editMilestoneId, setEditMilestoneId] = useState<
    string | number | null
  >(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoData>({
    name: "",
    clientIndustry: "",
    module: "",
    functionalScope: "",
    technicalScope: "",
    outOfScope: "",
    start_date: "",
    duration: "",
    status: "",
  });
  const [milestoneData, setMilestoneData] = useState({
    milestoneName: "",
    milestoneStart: "",
    milestoneEnd: "",
    milestoneDescDoc: "",
  });

  const handleFieldChange = (field: string, value: string) => {
    setMilestoneData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setIsEditing(false);
    setEditMilestoneId(null);

    setMilestoneData({
      milestoneName: "",
      milestoneStart: "",
      milestoneEnd: "",
      milestoneDescDoc: "",
    });
  };

  const isFormValid = Object.values(milestoneData).every(
    (val) => val.trim() !== ""
  );

  const handleEditMilestone = (m: IMilestone) => {
    setMilestoneData({
      milestoneName: m.name,
      milestoneStart: m.start_date ? formatYMD(m.start_date) : "",
      milestoneEnd: m.due_date ? formatYMD(m.due_date) : "",
      milestoneDescDoc: m.description ?? "",
    });

    setEditMilestoneId(m.id);
    setIsEditing(true);
    setOpenPopup(true);
  };

  const handleSaveMilestone = () => {
    if (!projectId) return;

    const payload = {
      name: milestoneData.milestoneName,
      description: milestoneData.milestoneDescDoc,
      start_date: milestoneData.milestoneStart,
      due_date: milestoneData.milestoneEnd,
      status: "active",
      required_hours: 0,
      project_id: Number(projectId),
    };

    if (isEditing && editMilestoneId) {
      updateMilestone(
        { milestoneId: editMilestoneId, body: payload },
        {
          onSuccess: () => {
            console.log("Milestone updated successfully");
            handleClosePopup();
            fetchMilestones();
          },
        }
      );
    } else {
      createMilestone(
        { projectId, body: payload },
        {
          onSuccess: () => {
            console.log("Milestone created successfully");
            handleClosePopup();
            fetchMilestones();
          },
          onError: (err) => console.error("Create milestone failed:", err),
        }
      );
    }
  };

  const { mutate: loadMilestones } = useGetProjectMilestones();

  const fetchMilestones = useCallback(() => {
    if (!projectId) return;

    loadMilestones(projectId, {
      onSuccess: (res) => {
        const list = res.data ?? [];

        const formatted = list.map((m: IMilestone) => ({
          id: m.id,
          name: m.name,
          dependencies: "N/A",
          details: m.description ?? "N/A",
          start_date: m.start_date ? formatYMD(m.start_date) : "N/A",
          end_date: m.due_date ? formatYMD(m.due_date) : "N/A",
          status: m.status ?? "N/A",

          onEdit: () => handleEditMilestone(m),
          onDelete: () => console.log("Delete milestone", m.id),
        }));

        setMilestones(formatted);
      },
      onError: (err) => console.error(err),
    });
  }, [projectId, loadMilestones]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const { mutate: loadProjectDetails } = useProjectDetails();

  useEffect(() => {
    if (!projectId) return;

    loadProjectDetails(projectId, {
      onSuccess: (res) => {
        const data = res.data;

        setProjectInfo({
          name: data?.name ?? "N/A",
          clientIndustry: `${data?.client?.username ?? "N/A"} - ${
            data?.company_name ?? "N/A"
          }`,
          module: "N/A",
          functionalScope: "N/A",
          technicalScope: "N/A",
          outOfScope: "N/A",
          start_date: formatYMD(data?.projectDetails?.start_date ?? ""),
          duration: data?.projectDetails?.duration
            ? `${data.projectDetails.duration} months`
            : "N/A",
          status: data?.status ?? "N/A",
        });
      },
      onError: (err) => console.error("Failed to load project details", err),
    });
  }, [projectId, loadProjectDetails]);

  return (
    <Sidebar>
      <ProjectDetailsLayout
        //stats={projectStats}
        projectInfo={projectInfo}
        teamMembers={teamMembers}
      >
        <DataTable
          title="Milestones"
          columns={milestoneColumns}
          rows={milestones}
          pageSize={10}
          showBackButton
          onBackClick={() => router.back()}
          onRowClick={(params) =>
            router.push(
              `${APP_ROUTES.CLIENT.PROJECTS}/${projectId}/taskdetail?id=${params.id}`
            )
          }
          actionButton={
            <AppButton
              label="Add Milestone"
              colorKey="BLUE"
              width={180}
              onClick={() => setOpenPopup(true)}
            />
          }
        />

        <DynamicPopup
          open={openPopup}
          onClose={handleClosePopup}
          title={isEditing ? "Update Milestone" : "Add Milestone"}
          buttonText={isEditing ? "Update" : "Add"}
          onSubmit={handleSaveMilestone}
          disableSubmit={!isFormValid}
          fields={mapMilestoneFieldsToPopup(
            getMilestoneFormFields(),
            milestoneData,
            handleFieldChange
          )}
        />
      </ProjectDetailsLayout>
    </Sidebar>
  );
}
