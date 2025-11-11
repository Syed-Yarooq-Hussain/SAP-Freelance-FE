"use client";

import React, { useState, useEffect } from "react";
import {Avatar,Box,Button,Grid,MenuItem,TextField,Typography,Divider,IconButton,} from "@mui/material";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { colors } from "@/utils/styles/colors";
import { MdClose } from "react-icons/md";
import AppButton from "../Button";

interface Experience {
  title: string;
  client: string;
  role: string;
  duration: string;
  technologies: string;
}

interface Review {
  client: string;
  rating: number;
  comment: string;
}

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
  experienceList: Experience[];
  reviewsList: Review[];
}


interface ProfileUpdateProps {
  profile: ProfileData;
  onUpdate: (updatedProfile: ProfileData) => void;
}

// ✅ Main component
const ProfileUpdate: React.FC<ProfileUpdateProps> = ({ profile, onUpdate }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileData>(profile);({
    skills: ["SAP SD, S/4HANA", "Order-to-Cash", "S/4HANA", "Integration", "Client Onboarding", "ABAP (basic)"],
  });

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, image: imageUrl });
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
    if (selectedSkill && !addedSkills.includes(selectedSkill)) {
      const updatedSkills = [...formData.skills, selectedSkill];
      onUpdate({ ...formData, skills: updatedSkills })
      setAddedSkills([...addedSkills, selectedSkill]);
      setSelectedSkill("");
    }
  };
    const handleRemoveSkill = (skillToRemove: string) => {
    setAddedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        p: 4,
        backgroundColor: "#fff",
        width: "100%",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Edit Profile
      </Typography>

      {/* PROFILE IMAGE & BASIC DETAILS */}
      <Grid container spacing={3}>
        <Grid size={{xs:12, md:3}} sx={{ textAlign: "center" }}>
          <label htmlFor="upload-photo">
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                alt="Profile"
                src={formData.image || "/default.png"}
                sx={{
                  width: 140,
                  height: 140,
                  margin: "auto",
                  cursor: "pointer",
                  border: "3px solid #f3f3f3",
                  boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiUpload size={50} color="#000" />
              </Box>
            </Box>
            <input
              id="upload-photo"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>
          <Typography sx={{ mt: 2, fontWeight: 600 }}>
            Upload Profile Photo
          </Typography>
        </Grid>

        <Grid size={{xs:12, md:9}}>
          <Grid container spacing={3}>
            {[
              { label: "Name", name: "name", value: formData.name },
              { label: "Location", name: "location", value: formData.location },
              { label: "Modules", name: "module", value: formData.module },
              { label: "Email", name: "email", value: formData.email },
              { label: "Hourly Rate", name: "hourlyRate", value: formData.hourlyRate },
              { label: "Experience", name: "experience", value: formData.experience },
            ].map((field, index) => (
              <Grid size={{xs:12, md:4}} key={index}>
                <Typography sx={{ mb: 1, fontSize: 12, fontWeight: 600 }}>
                  {field.label}
                </Typography>
                <TextField
                  fullWidth
                  name={field.name}
                  value={field.value}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f3f9ffff",
                      height: "36px",
                      fontSize: 14,
                      fontWeight: 600,
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* VISIBILITY + BIO */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{xs:12, md:6}}>
          <Typography sx={{ mb: 1, fontSize: 12, fontWeight: 600 }}>
            Visibility
          </Typography>
          <TextField
            select
            fullWidth
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f3f9ffff",
                height: "36px",
                fontSize: 14,
                fontWeight: 600,
              },
            }}
          >
            <MenuItem value="All clients">All clients</MenuItem>
            <MenuItem value="Private">Private</MenuItem>
            <MenuItem value="Public">Public</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{xs:12, md:6}}>
          <Typography sx={{ mb: 1, fontSize: 12, fontWeight: 600 }}>
            Weekly Hours
          </Typography>
          <TextField
            fullWidth
            name="weeklyHours"
            value={formData.weeklyHours}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f3f9ffff",
                height: "36px",
                fontSize: 14,
                fontWeight: 600,
              },
            }}
          />
        </Grid>

        <Grid size={{xs:12,}}>
          <Typography sx={{ mb: 1, fontSize: 12, fontWeight: 600 }}>
            Bio
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f3f9ffff",
                fontSize: 14,
                fontWeight: 600,
              },
            }}
          />
        </Grid>
      </Grid>

      {/* SECTION: Skills */}
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
          sx={{ minWidth: 300 ,backgroundColor:"#f3f9ff",
            "& .MuiInputBase-root": {
              height: 40,
              },
            "& .MuiInputBase-input": {
              padding: "8px 12px",
              fontSize: "0.9rem",},
             "& .MuiInputLabel-root": {
              top: -6,
              fontWeight: 600,
              fontSize: "0.9rem", 
    },}}
        >
          {formData.skills.map((skill, index) => (
            <MenuItem key={index} value={skill}>
              {skill}
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
        {addedSkills.map((skill, index) => (
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
            {skill}
             <IconButton
              size="small"
              onClick={() => handleRemoveSkill(skill)}
              sx={{ color: colors.BLUE, p: 0 }}
            >
              <MdClose size={18} />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>

      {/* SECTION: Experience */}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Experience
      </Typography>
      <Grid container spacing={3}>
        {formData.experienceList.map((exp, i) => (
          <Grid size={{xs:12, md:4}}
            key={i}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              background: "#fafafa",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {exp.title}
            </Typography>
            <Typography variant="body2">
              Client: <strong>{exp.client}</strong>
            </Typography>
            <Typography variant="body2">
              Role: <strong>{exp.role}</strong>
            </Typography>
            <Typography variant="body2">
              Duration: <strong>{exp.duration}</strong>
            </Typography>
            <Typography variant="body2">
              Technologies: <strong>{exp.technologies}</strong>
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* SECTION: Education */}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Education & Certifications
      </Typography>
      <ul style={{ marginTop: "1rem" }}>
        <li>{formData.education || "No education data"}</li>
        <li>{formData.certifications || "No certifications data"}</li>
      </ul>

      {/* SECTION: Reviews */}
      <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Reviews & Ratings
      </Typography>
      <Grid container spacing={3}>
        {formData.reviewsList.map((rev, i) => (
          <Grid size={{xs:12, md:4}}
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

      {/* ACTION BUTTONS */}
      <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.push("/client/profile")}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileUpdate;
