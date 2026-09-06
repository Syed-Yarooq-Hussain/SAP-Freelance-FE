"use client";

import { useConsultantDashboard } from "@/actions/consultants/useConsultantDashboard";
import { PageOnboardingTour } from "@/components/onboarding/PageOnboardingTour";
import { profileTourSteps } from "@/components/onboarding/tour-steps";
import { AUTOFILL_RESUME_TOUR_KEY } from "@/constants/onboarding";
import { patchFeatureTourService } from "@/services/onboarding";
import { CVUploadModal } from "@/components/profile/cv-upload-modal";
import ProfileEditPage from "@/components/profile/profile-edit";
import { ProfileLayout } from "@/components/profile-new/profile-layout";
import { useOnboarding } from "@/providers/OnboardingProvider";
import { updateConsultantProfile } from "@/services/consultants";
import { getConsultantMeService } from "@/services/getConsultantProfile";
import { updateUser } from "@/lib/store/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import { CertificationFormData } from "@/lib/schemas/certification";
import { EducationFormData } from "@/lib/schemas/education";
import { WorkExperienceFormData } from "@/lib/schemas/experience";
import { useEffect, useMemo, useState } from "react";

type ConsultantProfilePageProps = {
  tourVariant?: "profile" | "my_profile";
};

export function ConsultantProfilePageContent({
  tourVariant = "profile",
}: ConsultantProfilePageProps) {
  const user = useAppSelector((state: any) => state?.user?.user);
  const dispatch = useAppDispatch();
  const { currentStep, status, fetchError } = useOnboarding();
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useConsultantDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [scrollToClientsSummaryOnEdit, setScrollToClientsSummaryOnEdit] =
    useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [targetsReady, setTargetsReady] = useState(false);

  const handleCloseCVModal = () => setIsCVModalOpen(false);

  const updateProfile = async (
    payload: {
      work_experiences?: WorkExperienceFormData[];
      education?: EducationFormData[];
      certification?: CertificationFormData[];
      projects?: any[];
      clients_summary?: string;
    },
    userData?: {
      username?: string;
      city?: string;
      country?: string;
      phone?: string;
      currency?: string;
    },
  ) => {
    try {
      const payloadToSend = {
        consultant: {
          ...payload,
        },
        ...(userData && { user: { ...userData } }),
      };
      const res = await updateConsultantProfile(user?.id, payloadToSend as any);

      if (res.status === "success") {
        const consultantData = await getConsultantMeService();
        if (consultantData?.data) {
          dispatch(updateUser({ user: consultantData.data }));
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const handleCVAutofill = (cvData: any) => {
    if (cvData?.consultant) {
      const {
        clients_summary,
        work_experiences: cvWorkExp,
        education: cvEducation,
        certifications: cvCertifications,
        projects: cvProjects,
      } = cvData.consultant;
      const { username, city, country, phone, currency } = cvData.user;
      const updatedWorkExp =
        cvWorkExp && Array.isArray(cvWorkExp) ? cvWorkExp : user?.work_experiences;
      const updatedEducation =
        cvEducation && Array.isArray(cvEducation) ? cvEducation : user?.education;
      const updatedCertifications =
        cvCertifications && Array.isArray(cvCertifications)
          ? cvCertifications
          : user?.certification;

      const userData = {
        username: username ?? user?.user?.username,
        city: city ?? user?.user?.city,
        country: country ?? user?.user?.country,
        phone: phone ?? user?.user?.phone,
        currency: currency ?? user?.user?.currency,
      };

      updateProfile(
        {
          work_experiences: updatedWorkExp,
          education: updatedEducation,
          projects: cvProjects,
          certification: updatedCertifications,
          clients_summary: clients_summary ?? user?.user?.clients_summary,
        },
        userData,
      );
    }
  };

  const shouldRunProfileTour = useMemo(() => {
    if (fetchError || status === "completed") return false;
    return tourVariant === "profile" && currentStep === "profile";
  }, [currentStep, fetchError, status, tourVariant]);

  const autofillTourStepIndex = profileTourSteps.findIndex((step) =>
    String(step.target).includes("autofill-resume"),
  );

  useEffect(() => {
    if (!shouldRunProfileTour) {
      setTargetsReady(false);
      return;
    }

    if (!user || isDashboardLoading) {
      setTargetsReady(false);
      return;
    }

    setTargetsReady(true);
  }, [shouldRunProfileTour, user, isDashboardLoading]);

  const pageStep = "profile" as const;

  return (
    <div className="min-h-screen bg-background-main rounded-xl  -mt-4">
      <div className="mx-auto space-y-6">
        {isEditing ? (
          <div className="bg-white">
            <ProfileEditPage
              goBack={() => {
                setScrollToClientsSummaryOnEdit(false);
                setIsEditing(false);
              }}
              scrollToClientsSummary={scrollToClientsSummaryOnEdit}
            />
          </div>
        ) : (
          <div className=" py-4 px-4">
            <ProfileLayout
              consultant={user}
              setCvModalOpen={setIsCVModalOpen}
              onEnterEdit={(opts) => {
                setScrollToClientsSummaryOnEdit(
                  Boolean(opts?.scrollToClientsSummary),
                );
                setIsEditing(true);
              }}
              tourVariant={tourVariant}
            />
          </div>
        )}
        <CVUploadModal
          isOpen={isCVModalOpen}
          onClose={handleCloseCVModal}
          onAutofill={handleCVAutofill}
        />
      </div>

      {!fetchError && tourVariant === "profile" && (
        <PageOnboardingTour
          pageStep={pageStep}
          steps={profileTourSteps}
          run={shouldRunProfileTour && targetsReady}
          onStepAfter={(index) => {
            if (index !== autofillTourStepIndex) {
              return;
            }

            void patchFeatureTourService(
              AUTOFILL_RESUME_TOUR_KEY,
              "completed",
            ).catch((error) => {
              console.error("Failed to complete autofill resume tour:", error);
            });
          }}
        />
      )}
    </div>
  );
}
