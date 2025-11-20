"use client";

import AppButton from "@/components/Button";
import { CreateForm } from "@/components/CreateForm";
import ProfileAvatar from "@/components/ProfileAvatar";
import { clientProfileData, skillFormElements } from "@/data/clientProfile";
import {
  getProfileBottomFields,
  getProfileExtraFields,
  getProfileMainFields,
} from "@/forms/profileForm";
import { ProfileData } from "@/types/profile";
import { colors } from "@/utils/styles/colors";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

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
  module: "",
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

const getDefaultFromStatic = (): ProfileData => ({
  name: clientProfileData.profile.name,
  title: clientProfileData.profile.title,
  email: clientProfileData.profile.email,
  location: clientProfileData.profile.location,
  module: clientProfileData.profile.module,
  projects: clientProfileData.profile.projects,
  availability: clientProfileData.profile.availability,
  rate: clientProfileData.profile.rate,
  experience: clientProfileData.profile.experience,
  rating: clientProfileData.profile.rating,
  visibility: clientProfileData.profile.visibility,
  description: clientProfileData.profile.title,
  image: clientProfileData.profile.image,
  skills: clientProfileData.skills,
  certifications: "SAP Certified Professional",
  education: clientProfileData.education,
  experienceList: clientProfileData.experienceList,
  reviews: clientProfileData.reviews,
  reviewsList: clientProfileData.reviews,
});

const mainFields = getProfileMainFields();
const bottomFields = getProfileBottomFields();
const extraFields = getProfileExtraFields();

const ExperienceSection: React.FC<{
  experiences: ProfileData["experienceList"];
  editable: boolean;
}> = ({ experiences, editable }) => (
  <Box>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
      Skills &amp; Expertise
    </Typography>

    <Grid container spacing={2} sx={{ mb: 3 }}>
      {experiences.map((exp, i) => (
        <Grid key={`exp-${i}`} size={{ xs: 12, md: 4 }}>
          <Box sx={{ borderLeft: "3px solid #f50057", p: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
              {exp.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
              Client: <span style={{ color: "black" }}>{exp.client}</span>
            </Typography>
            <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
              Role: <span style={{ color: "black" }}>{exp.role}</span>
            </Typography>
            <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
              Duration: <span style={{ color: "black" }}>{exp.duration}</span>
            </Typography>
            <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
              Technologies:{" "}
              <span style={{ color: "black" }}>{exp.technologies}</span>
            </Typography>
            {editable && (
              <Stack direction="row" mt={1}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    sx={{
                      color: colors.BLUE,
                      "&:hover": { bgcolor: `${colors.BLUE}15` },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    sx={{
                      color: colors.RED,
                      "&:hover": { bgcolor: `${colors.RED}15` },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const EducationSection: React.FC<{
  education: string[];
  editable: boolean;
}> = ({ education, editable }) => (
  <Box>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
      Education &amp; Certifications
    </Typography>
    <ul style={{ listStyleType: "disc", paddingLeft: 40, margin: 0 }}>
      {education.map((edu, index) => (
        <li key={`edu-${index}`} style={{ marginBottom: "6px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography component="span" sx={{ fontWeight: 600 }}>
              {edu}
            </Typography>
            {editable && (
              <Stack direction="row">
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    sx={{
                      color: colors.BLUE,
                      "&:hover": { bgcolor: `${colors.BLUE}15` },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    sx={{
                      color: colors.RED,
                      "&:hover": { bgcolor: `${colors.RED}15` },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        </li>
      ))}
    </ul>
  </Box>
);

const ReviewsSection: React.FC<{
  reviews: ProfileData["reviews"];
}> = ({ reviews }) => (
  <Box>
    <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 3 }}>
      Reviews &amp; Ratings
    </Typography>
    <Grid container spacing={4}>
      {reviews.map((rev, index) => (
        <Grid
          key={`rev-${index}`}
          size={{ xs: 12, md: 4 }}
          sx={{
            borderLeft: "3px solid #4985eeff",
            height: "6.5rem",
            pl: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
            Client: <span style={{ color: "black" }}>{rev.client}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
            Rating: <span style={{ color: "black" }}>{rev.rating}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
            <span style={{ color: "black" }}>{rev.comment}</span>
          </Typography>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const Profile: React.FC<ProfileProps> = ({
  mode,
  onRequestEdit,
  onRequestView,
}) => {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [formData, setFormData] = useState<ProfileData>(emptyProfile);

  const viewImageUrl = profile.image;
  const editImageUrl = formData.image;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("profileData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged: ProfileData = {
          ...getDefaultFromStatic(),
          ...parsed,
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
          experienceList: Array.isArray(parsed.experienceList)
            ? parsed.experienceList
            : getDefaultFromStatic().experienceList,
          reviews: Array.isArray(parsed.reviews)
            ? parsed.reviews
            : getDefaultFromStatic().reviews,
          reviewsList: Array.isArray(parsed.reviewsList)
            ? parsed.reviewsList
            : getDefaultFromStatic().reviews,
        };
        setProfile(merged);
        setFormData(merged);
      } catch (e) {
        console.error("Invalid profileData in localStorage", e);
        const defaults = getDefaultFromStatic();
        setProfile(defaults);
        setFormData(defaults);
      }
    } else {
      const defaults = getDefaultFromStatic();
      setProfile(defaults);
      setFormData(defaults);
    }
  }, []);

  useEffect(() => {
    if (mode === "edit") {
      setFormData(profile);
    }
  }, [mode, profile]);

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

  const handleSkillSubmit = (data: FieldValues) => {
    const skill = (data.skill as string) || "";
    if (!skill) return;

    setFormData((prev) => {
      const current = prev.skills || [];
      if (current.includes(skill)) return prev;
      return { ...prev, skills: [...current, skill] };
    });
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skillToRemove),
    }));
  };

  if (mode === "view") {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
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
                name={profile.name || clientProfileData.profile.name}
                imageUrl={viewImageUrl}
                size={140}
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {clientProfileData.profile.name}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, maxWidth: 640 }}>
                {clientProfileData.profile.title || profile.description}
              </Typography>

              <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                Visibility:{" "}
                <span style={{ color: "black" }}>
                  {clientProfileData.profile.visibility || "All clients"}
                </span>
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container columns={12}>
              <Grid size={{ xs: 8, md: 6 }}>
                <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                  Module:{" "}
                  <span style={{ color: "black" }}>
                    {clientProfileData.profile.module}
                  </span>
                </Typography>
              </Grid>
              <Grid size={{ xs: 8, md: 6 }}>
                <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                  Projects:{" "}
                  <span style={{ color: "black" }}>
                    {clientProfileData.profile.projects}
                  </span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 8, md: 6 }}>
                <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                  Experience:{" "}
                  <span style={{ color: "black" }}>
                    {clientProfileData.profile.experience}
                  </span>
                </Typography>
              </Grid>
              <Grid size={{ xs: 8, md: 6 }}>
                <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                  Availability:{" "}
                  <span style={{ color: "black" }}>
                    {clientProfileData.profile.availability}
                  </span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 8, md: 6 }}>
                <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                  Rate:{" "}
                  <span style={{ color: "black" }}>
                    {clientProfileData.profile.rate}
                  </span>
                </Typography>
              </Grid>
              <Grid size={{ xs: 8, md: 6 }}>
                <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                  Rating:{" "}
                  <span style={{ color: "black" }}>
                    {clientProfileData.profile.rating}
                  </span>
                </Typography>
              </Grid>

              <Grid size={{ xs: 8, md: 6 }}>
                <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                  Location:{" "}
                  <span style={{ color: "black" }}>
                    {clientProfileData.profile.location}
                  </span>
                </Typography>
              </Grid>
              <Grid size={{ xs: 8, md: 6 }}>
                <Typography variant="body2" sx={{ color: "grey", mt: 2 }}>
                  Contact:{" "}
                  <span style={{ color: "black" }}>
                    {clientProfileData.profile.email}
                  </span>
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
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Skills &amp; Expertise
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
          {(profile.skills || []).map((skill, index) => (
            <Box
              key={index}
              sx={{
                border: "1.5px solid #1069f9ff",
                color: colors.BLUE,
                px: 2,
                py: 0.5,
                fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              <Typography variant="body2">{skill}</Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
        <ExperienceSection
          experiences={profile.experienceList || []}
          editable={false}
        />

        <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
        <EducationSection
          education={profile.education || []}
          editable={false}
        />

        <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
        <ReviewsSection reviews={profile.reviews || []} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Edit profile
      </Typography>

      <CreateForm
        elements={mainFields}
        onSuccess={handleCreateFormSuccess}
        actionsContainerProps={{ sx: { display: "none" } }}
        leadingContent={
          <label htmlFor="upload-photo">
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
              }}
            >
              <ProfileAvatar
                name={formData.name || clientProfileData.profile.name}
                imageUrl={editImageUrl}
                size={140}
              />
            </Box>
            <input
              id="upload-photo"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <CreateForm
            elements={bottomFields}
            onSuccess={handleCreateFormSuccess}
            actionsContainerProps={{ sx: { display: "none" } }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Box mt={3}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Skills &amp; Expertise
        </Typography>

        <CreateForm
          elements={skillFormElements}
          onSuccess={handleSkillSubmit}
          inlineActions
          submitButton={{
            children: "Add",
            sx: { minWidth: 180 },
          }}
        />

        <Box display="flex" flexWrap="wrap" gap={1.5} mt={3}>
          {(formData.skills || []).length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No skills selected yet.
            </Typography>
          ) : (
            (formData.skills || []).map((skill, index) => (
              <Box
                key={index}
                sx={{
                  border: "1.5px solid #1069f9ff",
                  color: colors.BLUE,
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Typography variant="body2">{skill}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveSkill(skill)}
                  sx={{ color: colors.BLUE, p: 0.25 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ExperienceSection
        experiences={formData.experienceList || []}
        editable={true}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <CreateForm
            elements={extraFields}
            onSuccess={handleCreateFormSuccess}
            actionsContainerProps={{ sx: { display: "none" } }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <EducationSection education={formData.education || []} editable={true} />

      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ReviewsSection reviews={formData.reviews || []} />

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
