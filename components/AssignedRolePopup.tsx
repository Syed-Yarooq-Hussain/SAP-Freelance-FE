"use client";

import { useConsultantLevels } from "@/actions/common/useConsultantLevels";
import { useUploadProjectDocument } from "@/actions/documents/useUploadProjectDocument";
import DynamicModal from "@/components/DynamicModal";
import { useToast } from "@/providers/ToastProvider";
import type { CandidateRow } from "@/types/teamBuilder";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import AppButton from "./Button";

const DOCUMENT_TYPES = ["NDA", "Service", "Property ownership", "Project contract"];

type ContractDocument = {
  id: string;
  type: string;
  name: string;
  documentId?: string | number;
  url?: string;
};

type AssignedRolePopupProps = {
  open: boolean;
  onClose: () => void;
  row: CandidateRow | null;
  projectId: string | number;
  onUpdated: () => void;
  onAssign: (role: string, contracts: string[]) => void;
};

export function AssignedRolePopup({
  open,
  onClose,
  row,
  projectId,
  onAssign,
}: AssignedRolePopupProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<
    ContractDocument[]
  >([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedRole, setRole] = useState("");
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const consultantLevels = useConsultantLevels();
  const uploadProjectDocument = useUploadProjectDocument();
  const { toast } = useToast();
  const assignedContractTypes = selectedDocuments.map((doc) => doc.type);

  useEffect(() => {
    if (open) {
      consultantLevels.mutate();
      setRole("");
      setSelectedDocuments([]);
      setSelectedDocumentType("");
    }
  }, [open]);

  const resetDocumentPicker = () => {
    setSelectedDocumentType("");
    if (uploadInputRef.current) uploadInputRef.current.value = "";
  };

  const addDocument = (document: ContractDocument) => {
    setSelectedDocuments((prev) => [
      ...prev.filter((item) => item.type !== document.type),
      document,
    ]);
    resetDocumentPicker();
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocumentType || !row?.id) return;

    const documentType = selectedDocumentType;

    uploadProjectDocument.mutate({
      file,
      projectId,
      userId: row.id,
      type: documentType,
    }, {
      onSuccess: (res) => {
        addDocument({
          id: `${documentType}-${file.name}-${Date.now()}`,
          type: documentType,
          name: file.name,
          documentId: res.data?.id ?? res.data?.doc_id,
          url: res.data?.url,
        });
        toast("Document uploaded successfully", "success");
      },
      onError: (error) => {
        if (uploadInputRef.current) uploadInputRef.current.value = "";
        toast(error.message || "Failed to upload document", "error");
      },
    });
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title="Assigned Role"
      width={480}
      actions={
        <>
          <AppButton
            label="Assign"
            onClick={() => onAssign(selectedRole, assignedContractTypes)}
            disabled={
              !selectedRole ||
              selectedDocuments.length === 0 ||
              uploadProjectDocument.isPending
            }
            colorKey="BLUE"
            width={180}
            sx={{
              fontWeight: 600,
              px: 4,
              py: 1,
            }}
          />
        </>
      }
    >
      {row && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            src={row.avatar}
            sx={{ width: 48, height: 48, bgcolor: "#e5e7eb" }}
          />

          <Box>
            <Typography fontWeight={700} sx={{ fontSize: "1rem" }}>
              {row.name || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.coremodules || row.othersmodules
                ? `${row.coremodules ?? ""} ${row.othersmodules ?? ""}`.trim()
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      )}

      <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 1 }}>
        Contract Document
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
        <TextField
          select
          fullWidth
          size="small"
          value={selectedDocumentType}
          onChange={(e) => setSelectedDocumentType(e.target.value)}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (selected: unknown) =>
                selected ? (
                  (selected as string)
                ) : (
                  <span style={{ color: "#9CA3AF" }}>Select document type</span>
                ),
            },
          }}
          sx={{
            ".MuiInputBase-root": {
              borderRadius: 1,
              bgcolor: "#F9FAFB",
            },
          }}
        >
          <MenuItem value="">
            <span style={{ color: "#9CA3AF" }}>Select document type</span>
          </MenuItem>

          {DOCUMENT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {selectedDocumentType && (
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => uploadInputRef.current?.click()}
            disabled={uploadProjectDocument.isPending}
            sx={{
              justifyContent: "flex-start",
              minHeight: 58,
              textTransform: "none",
              borderRadius: 1,
              borderStyle: "dashed",
              fontWeight: 700,
            }}
          >
            {uploadProjectDocument.isPending
              ? "Uploading document..."
              : `Upload ${selectedDocumentType} document`}
          </Button>
        )}

        <input
          ref={uploadInputRef}
          type="file"
          hidden
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
        />

        {selectedDocuments.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {selectedDocuments.map((document) => (
              <Box
                key={document.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  border: "1px solid #E5E7EB",
                  borderRadius: 1,
                  bgcolor: "#F9FAFB",
                  px: 1.25,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0,
                  }}
                >
                  <AttachFileIcon sx={{ color: "#4A7AB5", fontSize: 20 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {document.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {document.type} uploaded
                    </Typography>
                  </Box>
                </Box>

                <Tooltip title="Remove">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setSelectedDocuments((prev) =>
                        prev.filter((item) => item.id !== document.id)
                      )
                    }
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 1 }}>
        Role 
      </Typography>
      <TextField
        select
        fullWidth
        size="small"
        value={selectedRole}
        onChange={(e) => setRole(e.target.value)}
        slotProps={{
          select: {
            displayEmpty: true,
            renderValue: (selected: unknown) =>
              selected ? (
                (selected as string)
              ) : (
                <span style={{ color: "#9CA3AF" }}>Select role</span>
              ),
          },
        }}
        sx={{
          ".MuiInputBase-root": {
            borderRadius: 1,
            bgcolor: "#F9FAFB",
          },
        }}
      >
        <MenuItem value="">
          <span style={{ color: "#9CA3AF" }}>Select role</span>
        </MenuItem>

        {consultantLevels.isPending && <MenuItem disabled>Loading...</MenuItem>}

        {consultantLevels.data?.data?.map((level) => (
          <MenuItem key={level} value={level}>
            {level}
          </MenuItem>
        ))}
      </TextField>
    </DynamicModal>
  );
}
