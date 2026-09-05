"use client";

import { useClientMe } from "@/actions/clients/useClientProfile";
import { useUpdateClientProfile } from "@/actions/clients/useUpdateClientProfile";
import AppButton from "@/components/Button";
import { CreateForm } from "@/components/CreateForm";
import ProfileAvatar from "@/components/ProfileAvatar";
import { getClientProfileHeaderFields } from "@/forms/clientProfileForm";
import { ClientProfileData } from "@/types/profile";
import colors from "@/utils/styles/colors";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

type ProfileMode = "view" | "edit";

interface Props {
  mode: ProfileMode;
  onRequestEdit?: () => void;
  onRequestView?: () => void;
}

const emptyProfile: ClientProfileData = {
  name: "",
  email: "",
  city: "",
  country: "",
  phone: "",
  image: "/default.png",
};

const headerFields = getClientProfileHeaderFields();

const ClientProfile = ({ mode, onRequestEdit, onRequestView }: Props) => {
  const { data, isLoading } = useClientMe();
  const [profile, setProfile] = useState<ClientProfileData>(emptyProfile);
  const [formData, setFormData] = useState<ClientProfileData>(emptyProfile);
  const updateProfileMutation = useUpdateClientProfile();

  useEffect(() => {
    if (!data?.data) return;

    const mapped = {
      name: data.data.username ?? "",
      email: data.data.email ?? "",
      city: data.data.city ?? "",
      country: data.data.country ?? "",
      phone: data.data.phone ?? "",
      image: data.data.image || "/default.png",
    };

    setProfile(mapped);
    setFormData(mapped);
  }, [data]);

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        username: formData.name,
        email: formData.email,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
      });

      onRequestView?.();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (mode === "view") {
    return (
      <Box sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid #E2E8F0", borderRadius: 4, boxShadow: "0 8px 30px rgba(15,23,42,.06)", bgcolor: "background.paper" }}>
        <Grid container columns={12} spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box sx={{ mr: 3 }}>
              <ProfileAvatar
                name={profile.name}
                imageUrl={profile.image}
                size={140}
                sx={{
                  border: "4px solid #EAF5FA",
                  bgcolor: "rgba(25,118,210,0.12)",
                  color: colors.BLUE,
                  fontWeight: 700,
                }}
              />
            </Box>

            <Box>
              <Typography variant="h5" sx={{ color: "#0F172A" }}>
                <strong>{profile.name}</strong>
              </Typography>
              <Typography sx={{ mt: 0.5, color: "#64748B", fontSize: 14 }}>
                Client profile
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ p: 1.5, borderRadius: 2.5, bgcolor: "#F8FAFC" }}>
                  City: <strong>{profile.city || "—"}</strong>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ p: 1.5, borderRadius: 2.5, bgcolor: "#F8FAFC" }}>
                  Country: <strong>{profile.country || "—"}</strong>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ p: 1.5, borderRadius: 2.5, bgcolor: "#F8FAFC" }}>
                  Phone: <strong>{profile.phone || "—"}</strong>
                </Typography>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ p: 1.5, borderRadius: 2.5, bgcolor: "#F8FAFC" }}>
                  Email: <strong>{profile.email}</strong>
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
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid #E2E8F0", borderRadius: 4, boxShadow: "0 8px 30px rgba(15,23,42,.06)", bgcolor: "background.paper" }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Edit Profile
      </Typography>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 2 }}>
          <ProfileAvatar
            name={formData.name}
            imageUrl={formData.image}
            size={140}
            sx={{
              border: "4px solid #EAF5FA",
              bgcolor: "rgba(25,118,210,0.12)",
              color: colors.BLUE,
              fontWeight: 700,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <CreateForm
            elements={headerFields}
            defaultValues={formData}
            onSuccess={(data: FieldValues) =>
              setFormData((p) => ({ ...p, ...data }))
            }
            actionsContainerProps={{ sx: { display: "none" } }}
          />
        </Grid>
      </Grid>

      <Box mt={4} display="flex" gap={2}>
        <AppButton
          label="Save"
          colorKey="BLUE"
          width={180}
          loading={updateProfileMutation.isPending}
          onClick={handleSave}
        />
        <AppButton
          label="Cancel"
          colorKey="RED"
          width={180}
          onClick={onRequestView}
        />
      </Box>
    </Box>
  );
};

export default ClientProfile;
