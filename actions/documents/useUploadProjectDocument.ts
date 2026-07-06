"use client";

import {
  uploadProjectDocument,
  type UploadProjectDocumentPayload,
  type UploadProjectDocumentResponse,
} from "@/services/uploadProjectDocument";
import type { ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

export const useUploadProjectDocument = () => {
  return useMutation<
    ApiResponse<UploadProjectDocumentResponse>,
    Error,
    UploadProjectDocumentPayload
  >({
    mutationFn: uploadProjectDocument,
  });
};
