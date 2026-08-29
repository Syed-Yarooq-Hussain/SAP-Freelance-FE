"use client";

import { useState, useEffect, useMemo } from "react";
import type { AccountFormData } from "@/lib/schemas/account";
import Sidebar from "@/components/Sidebar";
import { PageOnboardingTour } from "@/components/onboarding/PageOnboardingTour";
import {
  waitForTourTarget,
  shouldRunOnboardingPageTour,
  getOnboardingStepPatchForPage,
} from "@/components/onboarding/onboarding-tour-utils";
import { accountTourSteps } from "@/components/onboarding/tour-steps";
import { useOnboarding } from "@/providers/OnboardingProvider";
import { updateConsultantProfile } from "@/services/consultants";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import { getConsultantMeService } from "@/services/getConsultantProfile";
import { logoutUser, updateUser } from "@/lib/store/features/user/userSlice";
import AccountSettings from "@/components/account-settings/account-settings";
import { toast } from "sonner";
import { useDeleteConsultantProfile } from "@/actions/consultants/useDeleteConsultantProfile";
import { useLogout } from "@/actions/auth/logout";
import { TrashIcon } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { usePathname } from "next/navigation";

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const user = useAppSelector((state) => state?.user?.user);
  const { currentStep, status, fetchError, advanceStep } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetsReady, setTargetsReady] = useState(false);
  const [accountTourDismissed, setAccountTourDismissed] = useState(false);
  const deleteProfile = useDeleteConsultantProfile();
  const { mutate: logout } = useLogout();

  const shouldRunTour = useMemo(
    () =>
      shouldRunOnboardingPageTour({
        pageStep: "my_profile",
        pathname,
        status,
        currentStep,
        fetchError,
        dismissed: accountTourDismissed,
      }),
    [
      accountTourDismissed,
      currentStep,
      fetchError,
      pathname,
      status,
    ],
  );

  useEffect(() => {
    const patchStep = getOnboardingStepPatchForPage("my_profile", currentStep);
    if (status !== "in_progress" || !patchStep) {
      return;
    }

    void advanceStep(patchStep);
  }, [advanceStep, currentStep, status]);

  useEffect(() => {
    if (!shouldRunTour) {
      setTargetsReady(false);
      return;
    }

    if (document.querySelector('[data-tour="account-settings"]')) {
      setTargetsReady(true);
      return;
    }

    let cancelled = false;

    void waitForTourTarget('[data-tour="account-settings"]').then((found) => {
      if (!cancelled) {
        setTargetsReady(found);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [shouldRunTour]);

  const handleSave = async (data: AccountFormData, apiPayload?: any) => {
    setIsLoading(true);
    try {
      const res = await updateConsultantProfile(user?.id, apiPayload);

      if (res.status == "success") {
        const consultantData = await getConsultantMeService();
        if (consultantData?.data) {
          dispatch(updateUser({ user: consultantData.data }));
        }
        toast.success("Account settings updated successfully!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update account settings!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    deleteProfile.mutate(undefined, {
      onSuccess: () => {
        toast.success("Account deleted successfully");
        dispatch(logoutUser());
        logout();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete account");
      },
    });
  };

  return (
    <Sidebar>
      <main className=" bg-white">
        <div className=" mx-auto px-4 py-8">
          <div className="flex d items-center justify-between">
            <div className="mb-4 font-manrope">
              <h1 className="text-2xl font-neue text-slate-900 tracking-tight">
                Account Settings
              </h1>
              <p className="text-sm text-light-grey mt-2 max-w-2xl">
                Manage your professional information and credentials
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-sm text-white px-4 py-2 rounded-md"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <TrashIcon className="w-4 h-4" />
                <span className="md:block hidden">Delete Account</span>
              </button>
            </div>
          </div>

          <div
            className="bg-white rounded-xl p-2 border border-slate-200 shadow-lg"
            data-tour="account-settings"
          >
            <AccountSettings onSubmit={handleSave} isLoading={isLoading} />
          </div>
        </div>
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          title="Delete account"
          message="Are you sure you want to delete your account? This action cannot be undone."
          confirmLabel={deleteProfile.isPending ? "Deleting..." : "Delete Account"}
          cancelLabel="Cancel"
          onCancel={() => {
            if (deleteProfile.isPending) return;
            setIsDeleteModalOpen(false);
          }}
          onConfirm={() => {
            if (deleteProfile.isPending) return;
            handleDeleteAccount();
          }}
        />
      </main>

      {!fetchError && (
        <PageOnboardingTour
          pageStep="my_profile"
          steps={accountTourSteps}
          run={shouldRunTour && targetsReady}
          onStepAfter={() => setAccountTourDismissed(true)}
        />
      )}
    </Sidebar>
  );
}
