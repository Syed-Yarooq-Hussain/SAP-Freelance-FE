import { ProfileData } from "@/types/profile";

export function mapProfileToForm(profile: ProfileData) {
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
