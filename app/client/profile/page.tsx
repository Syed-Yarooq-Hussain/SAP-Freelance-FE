"use client";

import React, { useEffect, useState } from "react";
import { ClientProfile } from "@/components/DetailProfile";
import Sidebar from "@/components/Sidebar";
import { ProfileData } from "@/types/ProfileData";

const ProfilePage: React.FC = () => {
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
    image: "/default.png",
    skills: [],
    experience: "",
    education: [],
    reviews: [],
    certifications: "",
    experienceList: [],
    reviewsList: [],
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("profileData");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        ...parsed,
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        experienceList: Array.isArray(parsed.experienceList)? parsed.experienceList: [],
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
      });
    }
  }, []);

  return (
    <Sidebar>
      <ClientProfile
        profileInfo={{
          name: profile.name,
          title: profile.title,
          email: profile.email,
          location: profile.location,
          description: profile.description,
          image: profile.image || "/default.png",
          module: profile.module,
          projects: profile.projects,
          experience: profile.experience,
          availability: profile.weeklyHours,
          rate: profile.hourlyRate,
          rating: profile.rating,
          visibility: profile.visibility,
        }}
        skills={profile.skills || []}
        education={profile.education || []}
        experienceList={ profile.experienceList}
        reviews={profile.reviews || []}
      />
    </Sidebar>
  );
};

export default ProfilePage;
