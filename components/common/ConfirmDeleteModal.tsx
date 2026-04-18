"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  icon?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  message,
  title = "Delete item",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  icon,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const isDanger = variant === "danger";
  const defaultIcon = isDanger ? (
    <Trash2 className="h-5 w-5 text-red-500" />
  ) : (
    <CheckCircle2 className="h-5 w-5 text-brand-blue" />
  );
  const iconContainerClass = isDanger ? "bg-red-50" : "bg-[#EAF1FB]";
  const confirmButtonClass = isDanger
    ? "bg-red-500 hover:bg-red-600"
    : "bg-brand-blue hover:bg-[#2676A1]";

  const content = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          aria-label="Close delete confirmation"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${iconContainerClass}`}
          >
            {icon ?? defaultIcon}
          </div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>

        <p className="text-sm text-slate-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-input border border-slate-300 text-slate-900 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-input text-white text-sm font-semibold transition-colors ${confirmButtonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

