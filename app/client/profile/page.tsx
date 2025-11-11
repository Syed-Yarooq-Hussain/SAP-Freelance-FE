"use client";

import React, { useEffect, useState } from "react";
import { ClientProfile } from "@/components/specific/Profile";
import Sidebar from "@/components/Sidebar";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>({
    skills: [],
    education: [],
    experience: [],
    reviews: [],
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("profileData");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        ...parsed,
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        experience: Array.isArray(parsed.experience) ? parsed.experience : [],
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
        experience={profile.experience || []}
        reviews={profile.reviews || []}
      />
    </Sidebar>
  );
};

export default ProfilePage;
