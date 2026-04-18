"use client";

import { useState } from "react";
import { ProfileView } from "@/components/account-settings/profile-view";
import { ProfileEdit } from "@/components/account-settings/profile-edit";
import type { AccountFormData } from "@/lib/schemas/account";
import Sidebar from "@/components/Sidebar";
import { updateConsultantProfile } from "@/services/consultants";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import { getConsultantMeService } from "@/services/getConsultantProfile";
import { updateUser } from "@/lib/store/features/user/userSlice";
import AccountSettings from "@/components/account-settings/account-settings";
import { toast } from "sonner";

const mockBadges = [
  {
    id: "1",
    label: "Verified",
    color: "green" as const,
    icon: "/images/green-tick-badge.svg",
  },
  {
    id: "2",
    label: "Top Rated",
    color: "blue" as const,
    icon: "/images/star-profile-badge.svg",
  },
  {
    id: "3",
    label: "Expert",
    color: "orange" as const,
    icon: "/images/leader-badge.svg",
  },
];

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state?.user?.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update account settings!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar>
      <main className=" bg-white">
        <div className=" mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-4 font-manrope">
            <h1 className="text-2xl font-neue text-slate-900 tracking-tight">
              Account Settings
            </h1>
            <p className="text-sm text-light-grey mt-2 max-w-2xl">
              Manage your professional information and credentials
            </p>
          </div>

          <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-lg">
            {/* Content */}
            {/* {isEditing ? (
              <ProfileEdit
                onSubmit={handleSave}
                isLoading={isLoading}
              />
            ) : (
              <ProfileView
                key={user?.id}
                badges={mockBadges}
                onEdit={() => setIsEditing(true)}
              />
            )} */}
            <AccountSettings onSubmit={handleSave} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </Sidebar>
  );
}
