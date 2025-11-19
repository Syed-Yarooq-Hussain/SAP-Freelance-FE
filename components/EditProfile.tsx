"use client";

import React, { useEffect, useState } from "react";
import {Avatar, Box ,Grid, MenuItem, TextField, Typography, Divider, IconButton,} from "@mui/material";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import AppButton from "./Button";
import { ProfileEducation, ProfileExperience, ProfileReview } from "./specific/Profile";
import { CreateForm } from "./CreateForm";
import { FieldValues } from "react-hook-form";
import {profileBottomElements, profileElements,profileExtraElements, projectFormElement,} from "@/data/clientProfile";
import { ProfileData } from "@/types/ProfileData";
import { colors } from "@/utils/styles/colors";

interface ProfileUpdateProps {
  profile: ProfileData; 
  onUpdate: (updatedProfile: ProfileData) => void;
}

const ProfileUpdate: React.FC<ProfileUpdateProps> = ({ profile, onUpdate }) => {
  const router = useRouter();
 const [formData, setFormData] = useState<ProfileData>({
  ...profile,
  skills: profile.skills && profile.skills.length > 0 
    ? profile.skills 
    : ["SAP SD, S/4HANA", "Order-to-Cash", "S/4HANA", "Integration", "Client Onboarding", "ABAP (basic)"],
});
  useEffect(() => { setFormData(profile); }, [profile]);

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
    localStorage.setItem("profileData", JSON.stringify(formData));
    onUpdate(formData);
    alert("✅ Profile Updated Successfully!");
    router.push("/client/profile");
  };

  const [selectedSkill, setSelectedSkill] = useState("");
  const [addedSkills, setAddedSkills] = useState<string[]>([]);

  const handleAddSkill = () => {
    if (!selectedSkill) return;
    if (addedSkills.includes(selectedSkill)) {
      setSelectedSkill("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s: string) => s !== selectedSkill),
    }));

    setAddedSkills((prev) => [...prev, selectedSkill]);
    setSelectedSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setAddedSkills((prev) => prev.filter((s) => s !== skillToRemove));

    setFormData((prev) => {
      const pool = prev.skills || [];
      return {
        ...prev,
        skills: pool.includes(skillToRemove) ? pool : [...pool, skillToRemove],
      };
    });
  };

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
        Edit Profile
      </Typography>

      {/*//////////////////////////// PROFILE IMAGE & BASIC DETAILS ////////////////////////////*/}
      <Grid container spacing={3}>
        <Grid size={{ xs:12, md:2}} sx={{ textAlign: "center" }}>
          <label htmlFor="upload-photo">
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                alt="Profile"
                src={formData.image || "/image.png"}
                sx={{
                  width: 140,
                  height: 140,
                  margin: "auto",
                  cursor: "pointer",
                  border: "3px solid #f3f3f3",
                  boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                }}
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
        </Grid>

        <Grid size={{ xs:12, md:9}}>
          <Grid container spacing={3}>
            {profileElements.map((field, index) => (
              <Grid size={{ xs:12, md:4}} key={index}>
                <CreateForm
                  elements={[
                    {
                      name: field.name,
                      type: "text",
                      placeholder: field.placeholder,
                      label: field.label,
                    },
                  ]}
                  onSuccess={handleCreateFormSuccess}
                  actionsContainerProps={{ sx: { display: "none" } }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* VisibiliTy + Weekly hours + Bio */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs:12, md:12}}>
          <CreateForm
            elements={profileBottomElements}
            onSuccess={handleCreateFormSuccess}
            actionsContainerProps={{ sx: { display: "none" } }}
          />
        </Grid>
      </Grid>

      {/*///////////////////////////////////// SECTION: SKILLS //////////////////////////////////*/}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Box mt={3}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Skills & Expertise
        </Typography>

        {/* Dropdown + Add button */}
        <Box display="flex" alignItems="center" gap={2} mt={2}>
       <TextField
          select
          label="Select skills"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          fullWidth
          sx={{
            width: 200,
            backgroundColor: "#f3f9ff",
            "& .MuiInputBase-root": { height: 40 },
            "& .MuiInputBase-input": { padding: "8px 12px", fontSize: "0.9rem" },
            "& .MuiInputLabel-root": { top: -6, fontWeight: 600, fontSize: "0.9rem" },
          }}
        >
         {projectFormElement.map((skill, index) => (
            <MenuItem key={index} value={skill.value}>
               {skill.label}
          </MenuItem>
         ))}

        </TextField>


          <AppButton
            label="Add"
            colorKey="BLUE"
            width={180}
            onClick={handleAddSkill}
          />
        </Box>

        {/* Added skills */}
        <Box display="flex" flexWrap="wrap" gap={1.5} mt={3}>
          {addedSkills.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No skills selected yet.
            </Typography>
          ) : (
            addedSkills.map((skill, index) => (
              <Box
                key={index}
                sx={{
                  border: "1.5px solid #1069f9ff",
                  color: colors?.BLUE || "#1069f9ff",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Reviews preview (left unchanged) */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {(formData.reviews || []).map((rev, i: number) => (
          <Grid
            size={{ xs:12, md:4}}
            key={i}
            sx={{
              borderLeft: "3px solid #4985eeff",
              pl: 2,
              background: "#fafafa",
              borderRadius: 1,
              py: 1.5,
            }}
          >
            <Typography variant="body2">
              Client: <strong>{rev.client}</strong>
            </Typography>
            <Typography variant="body2">
              Rating: <strong>{rev.rating}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {rev.comment}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/*////////////////////////////////// SECTION: EXPERIENCE /////////////////////////////*/}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ProfileExperience />

      {/*////////////////////////////////// SECTION: EXTRA BOXS /////////////////////////////*/}
      <Grid container spacing={2}>
        <Grid size={{ xs:12, md:12}}>
          <CreateForm
            elements={profileExtraElements}
            onSuccess={handleCreateFormSuccess}
            actionsContainerProps={{ sx: { display: "none" } }}
          />
        </Grid>
      </Grid>

      {/*////////////////////////////////// SECTION: EDUCATION ////////////////////////////////////*/}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ProfileEducation />

      {/*////////////////////////////////// SECTION: REVIEWS ///////////////////////////////////////*/}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <ProfileReview  />

      {/*////////////////////////////////// ACTION BUTTONS /////////////////////////////////////////*/}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
        <AppButton label="Save" colorKey="BLUE" width={180} onClick={handleSave} />
        <AppButton
          label="Discard"
          colorKey="RED"
          width={180}
          onClick={() => router.push("/client/profile")}
        />
      </Box>
    </Box>
  );
};

export default ProfileUpdate;
