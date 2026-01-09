import { ClientProfileData, ConsultantProfileData } from "@/types/profile";

export function mapConsultantProfileToForm(profile: ConsultantProfileData) {
  return {
    name: profile.name,
    email: profile.email,
    location: profile.location,

    module: {
      core: profile.module?.core ?? "",
      others: profile.module?.others ?? "",
    },

    experience: profile.experience,
    rate: profile.rate,
    availability: profile.availability,
    projects: profile.projects,

    rating: profile.rating,
    visibility: profile.visibility,
    description: profile.description,
  };
}

export function mapClientProfileToForm(profile: ClientProfileData) {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    country: profile.country,
  };
}
