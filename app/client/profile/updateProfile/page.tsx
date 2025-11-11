// app/client/profile/uploadProfile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import UpdateProfile from "@/components/specific/ProfileUpdate";
import { clientProfileData } from "@/data/clientProfile";

// ✅ TypeScript type for profile data
export interface ProfileData {
  name: string;
  title: string;
  email: string;
  location: string;
  module: string;
  projects: string | number;
  weeklyHours: string;
  hourlyRate: string;
  rating: string;
  visibility: string;
  description: string;
  image: string;
  skills: string[];
  experience: Array<{
    title: string;
    client: string;
    role: string;
    duration: string;
    technologies: string;
  }>;
  education: string[];
  reviews: Array<{
    client: string;
    rating: number;
    comment: string;
  }>;
  certifications: string;
  experienceList: Array<{
    title: string;
    client: string;
    role: string;
    duration: string;
    technologies: string;
  }>;
  reviewsList: Array<{
    client: string;
    rating: number;
    comment: string;
  }>;
}

const EditProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    title: "",
    email: "",
    location: "",
    module: "",
    projects: "",
    weeklyHours: "",
    hourlyRate: "",
    rating: "",
    visibility: "",
    description: "",
    image: "",
    skills: [],
    experience: [],
    education: [],
    reviews: [],
    certifications: "",
    experienceList: [],
    reviewsList: [],
  });

  useEffect(() => {
    // ✅ Only run on client
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("profileData");

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile({
          name: parsed.name || "",
          title: parsed.title || "",
          email: parsed.email || "",
          location: parsed.location || "",
          module: parsed.module || "",
          projects: parsed.projects || "",
          weeklyHours: parsed.weeklyHours || "",
          hourlyRate: parsed.hourlyRate || "",
          rating: parsed.rating || "",
          visibility: parsed.visibility || "",
          description: parsed.description || "",
          image: parsed.image || "",
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
          certifications: parsed.certifications || "SAP Certified Professional",
          experienceList: Array.isArray(parsed.experienceList)
            ? parsed.experienceList
            : [],
          reviewsList: Array.isArray(parsed.reviewsList)
            ? parsed.reviewsList
            : [],
        });
      } else {
        // ✅ Default profile from clientProfileData
        const flat: ProfileData = {
          ...clientProfileData.profile,
          skills: clientProfileData.skills,
          experience: clientProfileData.experience,
          education: clientProfileData.education,
          reviews: clientProfileData.reviews,
          certifications: "SAP Certified Professional",
          experienceList: clientProfileData.experience,
          reviewsList: clientProfileData.reviews,
          description: clientProfileData.profile.title,
          email: "",
          weeklyHours: "",
          hourlyRate: ""
        };
        setProfile(flat);
      }
    }
  }, []);

  // ✅ Update handler from UpdateProfile component
  const handleProfileUpdate = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
    localStorage.setItem("profileData", JSON.stringify(updatedProfile));
  };

  return (
    <Sidebar>
      <UpdateProfile profile={profile} onUpdate={handleProfileUpdate} />
    </Sidebar>
  );
};

export default EditProfilePage;
