"use client";

import AppButton from "@/components/Button";
import { CreateForm } from "@/components/CreateForm";
import DataTable from "@/components/DataTable";
import DynamicPopup from "@/components/Popup";
import {
    getMilestoneCols,
    initialMilestones,
    initialTasksByMilestone,
    milestoneFormElements,
    projectFormElements,
    taskColumns,
    taskFormElements,
} from "@/data/teamBuilder";
import { Box, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

type TeamProjectsProps = {
  onBack?: () => void;
  onNext?: () => void;
};

type FormData = Record<string, unknown>;

export type MilestoneRow = {
  id: number;
  name: string;
  date: string;
  description: string;
  approval: "Required" | "Not required";
  tasks: number;
};

export type TaskRow = {
  id: string;
  name: string;
  date: string;
  description: string;
  assignees: string;
};

type TasksByMilestone = Record<number, TaskRow[]>;

export default function TeamProjects({ onBack, onNext }: TeamProjectsProps) {
  const [rows] = useState<MilestoneRow[]>(initialMilestones);
  const [tasksByMilestone] = useState<TasksByMilestone>(
    initialTasksByMilestone
  );

  const [expandedMilestoneId, setExpandedMilestoneId] = useState<number | null>(
    null
  );
  const [popupKind, setPopupKind] = useState<
    "functional" | "technical" | "out" | null
  >(null);
  const [scopeText, setScopeText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const handleSubmit = useCallback(
    (data: FormData) => {
      console.log("Step 03 (Project) form data:", data);
      onNext?.();
    },
    [onNext]
  );

  const openPopup = (kind: "functional" | "technical" | "out") => {
    setPopupKind(kind);
    setScopeText("");
    setUploadedFile(null);
  };

  const closePopup = () => {
    setPopupKind(null);
    setScopeText("");
    setUploadedFile(null);
  };

  const saveScope = () => {
    console.log(`Saved ${popupKind} scope:`, {
      description: scopeText.trim(),
      file: uploadedFile,
    });
    closePopup();
  };

  const popupTitle =
    popupKind === "functional"
      ? ""
      : popupKind === "technical"
      ? ""
      : popupKind === "out"
      ? ""
      : "";

  const popupDescription =
    popupKind === "functional"
      ? "Upload Functional Scope Documents OR write by yourself."
      : popupKind === "technical"
      ? "Upload Technical Scope Documents OR write by yourself."
      : popupKind === "out"
      ? "Upload Out-of-Scope Documents OR write by yourself."
      : undefined;

  const handleAddMilestone = (data: FormData) => {
    console.log("Milestone form:", data);
  };

  const handleAddTask = (data: FormData) => {
    console.log("Task form:", data);
  };

  const milestoneCols = useMemo(
    () => getMilestoneCols(expandedMilestoneId, setExpandedMilestoneId),
    [expandedMilestoneId]
  );

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
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Basic Details
      </Typography>

      <CreateForm
        elements={projectFormElements}
        onSuccess={handleSubmit}
        actionsContainerProps={{ sx: { display: "none" } }}
      />

      <Box sx={{ borderTop: "1px solid #eee", my: 2 }} />

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Project Scope
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
        }}
      >
        <AppButton
          label="Add Functional Scope"
          colorKey="BLUE"
          onClick={() => openPopup("functional")}
          sx={{ width: "100%" }}
        />
        <AppButton
          label="Add Technical Scope"
          colorKey="BLUE"
          onClick={() => openPopup("technical")}
          sx={{ width: "100%" }}
        />
        <AppButton
          label="Add Out of Scope"
          colorKey="BLUE"
          onClick={() => openPopup("out")}
          sx={{ width: "100%" }}
        />
      </Box>

      <Box sx={{ borderTop: "1px solid #eee", my: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Milestones
        </Typography>

        <DataTable<MilestoneRow>
          title=""
          columns={milestoneCols}
          rows={rows}
          pageSize={5}
        />

        {expandedMilestoneId !== null && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              border: "1px solid #d8dfef",
              bgcolor: "#fbfcff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Task
            </Typography>

            {(tasksByMilestone[expandedMilestoneId]?.length ?? 0) > 0 && (
              <DataTable<TaskRow>
                title=""
                columns={taskColumns}
                rows={tasksByMilestone[expandedMilestoneId] || []}
                pageSize={Math.min(
                  4,
                  tasksByMilestone[expandedMilestoneId]?.length ?? 0
                )}
              />
            )}

            <CreateForm
              elements={taskFormElements.map((el) =>
                el.name === "taskMilestone"
                  ? {
                      ...el,
                      options: rows.map((m) => ({
                        label: m.name,
                        value: String(m.id),
                      })),
                    }
                  : el
              )}
              onSuccess={handleAddTask}
              actionsContainerProps={{
                sx: { mt: 2, justifyContent: "flex-start" },
              }}
              submitButton={{ children: "Add" }}
            />
          </Box>
        )}

        <CreateForm
          elements={milestoneFormElements}
          onSuccess={handleAddMilestone}
          actionsContainerProps={{
            sx: { mt: 2, justifyContent: "flex-start" },
          }}
          submitButton={{ children: "Add" }}
        />
      </Box>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box />
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <AppButton
            label="Proceed to next step"
            colorKey="BLUE"
            onClick={onNext}
            width={180}
          />
          <AppButton
            label="Discard"
            colorKey="RED"
            onClick={onBack}
            width={180}
          />
        </Box>
      </Box>

      <DynamicPopup
        open={popupKind !== null}
        onClose={closePopup}
        title={popupTitle}
        description={popupDescription}
        fields={[
          {
            id: "scope",
            label: "",
            type: "text",
            value: scopeText,
            onChange: (val: string | File) =>
              typeof val === "string" && setScopeText(val),
            placeholder: "Description",
          },
        ]}
        fileUpload
        fileValue={uploadedFile}
        onFileChange={(f) => setUploadedFile(f)}
        buttonText="Save"
        buttonColor="BLUE"
        onSubmit={saveScope}
        disableSubmit={!scopeText.trim()}
      />
    </Box>
  );
}
