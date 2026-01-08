"use client";

import { useConsultantMe } from "@/actions/consultants/useConsultantMe";
import AppButton from "@/components/Button";
import { CreateForm } from "@/components/CreateForm";
import ProfileAvatar from "@/components/ProfileAvatar";
import {
  educationFormElements,
  getProfileBottomFields,
  getProfileCommercialFields,
  getProfileHeaderFields,
  getProfileModuleFields,
  workExperienceFormElements,
} from "@/forms/profileForm";
import { ProfileData } from "@/types/profile";
import { mapConsultantProfile } from "@/utils/mapConsultantProfile";
import { mapProfileToForm } from "@/utils/mapProfileForm";
import colors from "@/utils/styles/colors";
import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import ProfileEducationSection from "../ProfileEducationSection";
import ProfileExperienceSection from "../ProfileExperienceSection";
import ProfileReviewsSection from "../ProfileReviewsSection";
import ProfileSkillsSection from "../ProfileSkillsSection";

type ProfileMode = "view" | "edit";

interface ProfileProps {
  mode: ProfileMode;
  onRequestEdit?: () => void;
  onRequestView?: () => void;
}

const emptyProfile: ProfileData = {
  name: "",
  title: "",
  email: "",
  location: "",
  module: { core: "N/A", others: "N/A" },
  projects: "",
  availability: "",
  rate: "",
  experience: "",
  rating: "",
  visibility: "",
  description: "",
  image: "/default.png",
  skills: [],
  certifications: "",
  education: [],
  experienceList: [],
  reviews: [],
  reviewsList: [],
};

const headerFields = getProfileHeaderFields();
const moduleFields = getProfileModuleFields();
const commercialFields = getProfileCommercialFields();
const bottomFields = getProfileBottomFields();

const Profile: React.FC<ProfileProps> = ({
  mode,
  onRequestEdit,
  onRequestView,
}) => {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [formData, setFormData] = useState<ProfileData>(emptyProfile);
  const viewImageUrl = profile.image;
  const editImageUrl = formData.image;
  const { data, isLoading } = useConsultantMe();
  const formDefaults = mapProfileToForm(formData);

  useEffect(() => {
    if (!data?.data) return;
    const mapped = mapConsultantProfile(data.data);
    setProfile(mapped);
    setFormData(mapped);
  }, [data]);

  useEffect(() => {
    if (mode === "edit") {
      setFormData(profile);
    }
  }, [mode, profile]);

  if (isLoading) {
    return (
      <Box p={4}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  const handleCreateFormSuccess = (data: FieldValues) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSave = () => {
    setProfile(formData);
    if (typeof window !== "undefined") {
      localStorage.setItem("profileData", JSON.stringify(formData));
    }
    onRequestView?.();
  };

  const handleDiscard = () => {
    setFormData(profile);
    onRequestView?.();
  };

  const handleAddExperience = (data: FieldValues) => {
    setFormData((prev) => ({
      ...prev,
      experienceList: [
        ...(prev.experienceList || []),
        {
          title: data.company,
          client: data.company,
          role: data.role,
          duration: `${data.startDate} - ${data.endDate || "Present"}`,
          technologies: data.technologies,
        },
      ],
    }));
  };

  const handleAddEducation = (data: FieldValues) => {
    const entry = `${data.degree} — ${data.institution} (${data.startDate} - ${
      data.endDate || "Present"
    })`;

    setFormData((prev) => ({
      ...prev,
      education: [...(prev.education || []), entry],
    }));
  };

  if (mode === "view") {
    return (
      <Box
        sx={{
          p: 2,
          boxShadow: 2,
          bgcolor: "background.paper",
        }}
      >
        <Grid container columns={12} spacing={8} alignItems="center">
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box sx={{ mr: 3 }}>
              <ProfileAvatar
                name={profile.name}
                imageUrl={viewImageUrl}
                size={140}
                sx={{
                  border: "2px solid #000",
                  bgcolor: "rgba(25,118,210,0.12)",
                  color: colors.BLUE,
                  fontWeight: 700,
                }}
              />
            </Box>
            <Box>
              <Typography variant="h6">{profile.name}</Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  maxWidth: 640,
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {profile.title}
              </Typography>

              <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                Visibility:{" "}
                <span style={{ color: "black" }}>{profile.visibility}</span>
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Core Modules:{" "}
                  <span style={{ color: "black" }}>{profile.module?.core}</span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Projects:{" "}
                  <span style={{ color: "black" }}>{profile.projects}</span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Other Modules:{" "}
                  <span style={{ color: "black" }}>
                    {profile.module?.others}
                  </span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Availability:{" "}
                  <span style={{ color: "black" }}>
                    {profile.availability || "—"} hrs/week
                  </span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Experience:{" "}
                  <span style={{ color: "black" }}>
                    {profile.experience} Years
                  </span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Location:{" "}
                  <span style={{ color: "black" }}>{profile.location}</span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Rate:{" "}
                  <span style={{ color: "black" }}>${profile.rate}/hour</span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Contact:{" "}
                  <span style={{ color: "black" }}>{profile.email}</span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Rating:{" "}
                  <span style={{ color: "black" }}>{profile.rating}</span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box display="flex" gap={1.5} mt={3}>
          <AppButton
            label="Edit"
            colorKey="BLUE"
            width={180}
            onClick={onRequestEdit}
          />
          <AppButton label="Delete Account" colorKey="RED" width={180} />
        </Box>

        <Divider sx={{ my: 4, borderBottomWidth: 2 }} />

        <ProfileSkillsSection
          skills={profile.skills}
          editable={false}
          onAdd={() => {}}
          onRemove={() => {}}
        />

        <Divider sx={{ my: 4, borderBottomWidth: 2 }} />

        <ProfileExperienceSection
          experiences={profile.experienceList || []}
          editable={false}
          onChange={() => {}}
        />

        <Divider sx={{ my: 4, borderBottomWidth: 2 }} />

        <ProfileEducationSection
          education={profile.education || []}
          editable={false}
          onChange={() => {}}
        />

        <Divider sx={{ my: 4, borderBottomWidth: 2 }} />

        <ProfileReviewsSection reviews={profile.reviews} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Edit profile
      </Typography>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 2 }}>
          <ProfileAvatar
            name={profile.name}
            imageUrl={editImageUrl}
            size={140}
            sx={{
              border: "2px solid #000",
              bgcolor: "rgba(25,118,210,0.12)",
              color: colors.BLUE,
              fontWeight: 700,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 10 }}>
          <CreateForm
            elements={headerFields}
            defaultValues={formDefaults}
            onSuccess={handleCreateFormSuccess}
            actionsContainerProps={{ sx: { display: "none" } }}
          />
        </Grid>
      </Grid>
      <CreateForm
        elements={moduleFields}
        defaultValues={formDefaults}
        onSuccess={handleCreateFormSuccess}
        actionsContainerProps={{ sx: { display: "none" } }}
      />
      <CreateForm
        elements={commercialFields}
        defaultValues={formDefaults}
        onSuccess={handleCreateFormSuccess}
        actionsContainerProps={{ sx: { display: "none" } }}
      />
      <CreateForm
        elements={bottomFields}
        defaultValues={formDefaults}
        onSuccess={handleCreateFormSuccess}
        actionsContainerProps={{ sx: { display: "none" } }}
      />
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />

      <ProfileSkillsSection
        skills={formData.skills}
        editable
        onAdd={(skill) =>
          setFormData((prev) =>
            prev.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
              ? prev
              : { ...prev, skills: [...prev.skills, skill] }
          )
        }
        onRemove={(skill) =>
          setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
          }))
        }
      />

      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ProfileExperienceSection
        experiences={formData.experienceList || []}
        editable={true}
        onChange={(updated) =>
          setFormData((p) => ({ ...p, experienceList: updated }))
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          {mode === "edit" && (
            <>
              <CreateForm
                elements={workExperienceFormElements}
                onSuccess={handleAddExperience}
                inlineActions
                submitButton={{
                  children: "Add Experience",
                  sx: { minWidth: 200 },
                }}
              />
            </>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ProfileEducationSection
        education={formData.education || []}
        editable={true}
        onChange={(updated) =>
          setFormData((p) => ({ ...p, education: updated }))
        }
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          {mode === "edit" && (
            <>
              <CreateForm
                elements={educationFormElements}
                onSuccess={handleAddEducation}
                inlineActions
                submitButton={{
                  children: "Add Education",
                  sx: { minWidth: 200 },
                }}
              />
            </>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ProfileReviewsSection reviews={profile.reviews} />

      <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
        <AppButton
          label="Save"
          colorKey="BLUE"
          width={180}
          onClick={handleSave}
        />
        <AppButton
          label="Discard"
          colorKey="RED"
          width={180}
          onClick={handleDiscard}
        />
      </Box>
    </Box>
  );
};

export default Profile;
