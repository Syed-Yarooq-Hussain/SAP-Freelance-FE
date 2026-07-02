"use client";

import { uploadDocument, type UploadDocumentResponse } from "@/services/uploadDocument";
import type { ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

export const useUploadDocument = () => {
  return useMutation<ApiResponse<UploadDocumentResponse>, Error, { file: File; type?: string }>({
    mutationFn: async ({ file, type = "client_payment" }) =>
      uploadDocument(file, type),
  });
};
