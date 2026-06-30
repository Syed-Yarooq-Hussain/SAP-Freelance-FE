"use client";

import Sidebar from "@/components/Sidebar";
import { updatePassword } from "@/services/user";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createChangePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/schemas/change-password";
import { PasswordInput } from "@/components/homepage/ui/PasswordInput";
import React, { useMemo, useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import { useAppSelector } from "@/lib/store/hook";

const ChangePasswordPage = () => {
  const { toast } = useToast();
  const user = useAppSelector((state) => state.user.user);
  const isLoginFromLinkedin = Boolean(
    user?.loginWithLinkedin ?? user?.user?.loginWithLinkedin
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = useMemo(
    () => createChangePasswordSchema(!isLoginFromLinkedin),
    [isLoginFromLinkedin]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(validationSchema) as never,
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      await updatePassword({
        ...(isLoginFromLinkedin ? {} : { oldPassword: data.oldPassword }),
        newPassword: data.newPassword,
      });
      toast("Password updated successfully", "success");
      reset();
    } catch (err: any) {
      toast(err?.message ?? "Failed to update password", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sidebar>
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white  border border-slate-200 p-6 md:p-8 font-manrope">
        <div className="w-full max-w-5xl mx-auto mb-8">
          <h1 className="text-2xl md:text-3xl font-neue text-slate-900 tracking-tight">
            Change Password
          </h1>
          <p className="text-sm font-manrope text-light-grey mt-2">
            Update your account password securely
          </p>
        </div>

        <div className="flex flex-col items-stretch justify-center w-full max-w-5xl mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 w-full font-manrope"
          >
            <div
              className={`grid grid-cols-1 gap-4 items-start ${
                isLoginFromLinkedin ? "md:grid-cols-2" : "md:grid-cols-3"
              }`}
            >
              {!isLoginFromLinkedin && (
                <Controller
                  name="oldPassword"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      label="Current password"
                      placeholder="Enter your current password"
                      error={errors.oldPassword?.message}
                      required
                      autoComplete="current-password"
                    />
                  )}
                />
              )}

              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="New password"
                    placeholder="Enter new password"
                    error={errors.newPassword?.message}
                    required
                    autoComplete="new-password"
                    showStrength
                  />
                )}
              />

              <Controller
                name="confirmNewPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="Confirm new password"
                    placeholder="Confirm new password"
                    error={errors.confirmNewPassword?.message}
                    required
                    autoComplete="new-password"
                  />
                )}
              />
            </div>

            <div className="bg-brand-yellow border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-manrope text-slate-900 font-bold mb-2">
                Password requirements
              </p>
              <ul className="text-xs font-manrope text-slate-600 space-y-1.5 leading-relaxed">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 shrink-0 bg-slate-400 rounded-full" />
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 shrink-0 bg-slate-400 rounded-full" />
                  Contains uppercase and lowercase letters
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 shrink-0 bg-slate-400 rounded-full" />
                  Contains at least one number
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 shrink-0 bg-slate-400 rounded-full" />
                  Contains at least one special character
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-blue text-white font-manrope text-sm font-semibold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-blue/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </Sidebar>
  );
};

export default ChangePasswordPage;
