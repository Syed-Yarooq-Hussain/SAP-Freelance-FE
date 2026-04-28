"use client";

import { ProfileImage } from "./profile-image";
import { ProfileHeader } from "./profile-header";
import { ProfessionalSummary } from "./professional-summary";
import { ProfessionalInfo } from "./professional-info";
import { OtherModulesSection } from "./other-modules-section";
import { CompletionCard } from "./completion-card";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit,
  File,
  FolderOpen,
  MapPin,
  Star,
} from "lucide-react";
import ContactInfo from "./contactInfo";
import UserInfo from "./userInfo";
import CoreModules from "./coreModules";
import ProfileSpecification from "./profile-specification";

interface ProfileLayoutProps {
  consultant: any;
  setCvModalOpen: (open: boolean) => void;
  setIsEditing: (editing: boolean) => void;
}

export function ProfileLayout({
  consultant,
  setCvModalOpen,
  setIsEditing,
}: ProfileLayoutProps) {
  const user = consultant?.user;
  const profileBadges: string[] = consultant?.badges || [];
  const coreModules =
    consultant?.user?.module?.core?.split(", ").filter(Boolean) || [];
  const otherModules =
    consultant?.user?.module?.others?.split(", ").filter(Boolean) || [];
  const coreModulesStr: string[] =
    user?.user?.modules
      ?.filter((module: any) => module?.is_primary)
      ?.map((module: any) => module?.module?.name) || [];
  const mobileTitle = coreModulesStr.length
    ? `${coreModulesStr.join(" · ")}`
    : "SAP Consultant";
  const experienceText =
    consultant?.experience || consultant?.years_of_experience || "-";
  const locationText = [user?.city].filter(Boolean).join(", ");
  const memberSince = (() => {
    const rawDate =
      consultant?.created_at || consultant?.createdAt || user?.created_at;
    if (!rawDate) return "-";
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  })();
  const mobileStats = [
    {
      label: "Hourly Rate",
      value: `$ ${consultant?.rate || "-"}` + " / hr",
      icon: null,
    },
    {
      label: "Working Hours",
      value: `${consultant?.weekly_available_hours || "-"} Hrs`,
      icon: Clock3,
    },
    {
      label: "Location",
      value: locationText || "-",
      icon: MapPin,
    },
    {
      label: "Member Since",
      value: memberSince,
      icon: CalendarDays,
    },
    {
      label: "Projects",
      value: `${consultant?.projects?.length || 0} done`,
      icon: FolderOpen,
    },
  ];

  const completionPercentage =
    Math.round(
      (Object.keys(consultant || {}).filter((key) => {
        const value = consultant?.[key];
        return value && value !== null && value !== "";
      }).length /
        Object.keys(consultant || {}).length) *
        100,
    ) || 0;

  return (
    <div className="min-h-screen bg-background-main">
      {/* Top Action Buttons */}
      {/* <div className="sticky top-0 z-40 bg-background-main backdrop-blur border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-end gap-3">
          <button onClick={() => setCvModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-200 transition font-medium text-sm">
            <File className="w-4 h-4" />
            Autofill by Resume
          </button>
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue text-white hover:shadow-lg transition font-medium text-sm">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div> */}

      <div className="mx-auto">
        {/* Profile Header Section */}
        <div className="border  border-none md:border-slate-200 rounded-2xl md:p-4 p-0 mb-4">
          <div className="sticky md:block hidden top-0 z-40 bg-transparent md:bg-background-main backdrop-blur border-slate-200 mb-2">
            <div className="max-w-7xl mx-auto  flex justify-end gap-3 ">
              <button
                onClick={() => setCvModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-200 transition font-medium text-xs"
              >
                <File className="w-3 h-3" />
                <span className="hidden md:block">Autofill by Resume</span>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue text-white hover:shadow-lg transition font-medium text-xs"
              >
                <Edit className="w-3 h-3" />
                <span className="hidden md:block">Edit Profile</span>
              </button>
            </div>
          </div>
          <div className="flex md:flex-row flex-col">
            <div className="flex flex-col bg-background-main md:bg-transparent rounded-xl md:p-4 p-0 md:flex-row gap-8">
              <div className="flex-shrink-0 ">
                <div className="md:block hidden">
                  <ProfileImage
                    imageUrl={user?.avatar}
                    name={user?.username || "User"}
                  />
                </div>
                <div className="md:block hidden">
                  <ContactInfo
                    linkedin_url={user?.linkedin_url}
                    email={user?.email}
                    phone={user?.phone}
                  />
                </div>
                <div className="md:hidden block rounded-3xl border border-slate-200 bg-[#f5f5f5] p-4">
                  <div className="flex justify-end gap-2 mb-3">
                    <button
                      onClick={() => setCvModalOpen(true)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-white text-slate-600 border border-slate-200"
                    >
                      <File className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-blue text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="md:hidden block">
                    <ProfileImage
                      imageUrl={user?.avatar}
                      name={user?.username || "User"}
                    />
                  </div>
                  <h1 className="text-2xl mt-8 font-bold text-center text-slate-900 font-manrope">
                    {user?.username || "User"}
                  </h1>

                  <div className="mt-3 flex items-center justify-center flex-wrap gap-2">
                    {profileBadges.map((badge) => (
                      <span
                        key={badge}
                        className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm text-white ${
                          badge === "VERIFIED" ? "bg-success" : "bg-brand-blue"
                        }`}
                      >
                        {badge === "VERIFIED" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                        {badge === "VERIFIED" ? "Verified" : "Certified"}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-center text-xl font-neue text-slate-900">
                    {mobileTitle}{" "}
                    <span className="font-normal">
                      · {experienceText} yrs experience
                    </span>
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {mobileStats.map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-2xl flex-1 border border-slate-300 bg-white px-3 py-3 ${
                          item.label === "Projects" ? "col-span-1" : ""
                        }`}
                      >
                        <p className="text-xxs text-slate-500">{item.label}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-900 font-neue">
                          {item.icon ? <item.icon className="w-5 h-5" /> : null}
                          <span>{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <ProfileHeader setIsEditing={setIsEditing} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-2xl">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {otherModules.length > 0 && <OtherModulesSection />}
            <CompletionCard
              completionPercentage={completionPercentage}
              onEdit={() => setIsEditing(true)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 md:bg-transparent bg-background-main">
            <ProfessionalInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
