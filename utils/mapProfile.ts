import { ClientProfileData, ConsultantProfileData } from "@/types/profile";

export const mapConsultantProfile = (apiData: any): ConsultantProfileData => {
  const user = apiData?.user ?? {};
  const consultant = apiData ?? {};

  return {
    name: user.username?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? "",
    title: consultant.clients_summary ?? "",
    description: consultant.clients_summary ?? "",
    email: user.email ?? "",
    location: `${user.city ?? ""}, ${user.country ?? ""}`.replace(
      /^, |, $/g,
      ""
    ),

    module: user.module ?? { core: "", others: "" },

    experience:
      consultant.experience !== null && consultant.experience !== undefined
        ? String(consultant.experience)
        : "",

    rate:
      consultant.rate !== null && consultant.rate !== undefined
        ? String(consultant.rate)
        : "",

    availability:
      consultant.weekly_available_hours !== null &&
      consultant.weekly_available_hours !== undefined
        ? String(consultant.weekly_available_hours)
        : "",

    projects:
      consultant.projects_count !== null &&
      consultant.projects_count !== undefined
        ? String(consultant.projects_count)
        : "0",

    rating: "0",
    visibility: "All clients",
    image: "/default.png",

    skills: Array.isArray(consultant.skills) ? consultant.skills : [],

    certifications: "—",

    experienceList:
      consultant.work_experiences?.map((exp: any) => ({
        title: exp.company_name || "—",
        client: exp.position || "—",
        role: exp.position || "—",
        duration: `${exp.start_date || "—"} - ${exp.end_date || "—"}`,
        technologies: Array.isArray(exp.responsibilities)
          ? exp.responsibilities.join(", ")
          : "—",
      })) ?? [],

    education:
      consultant.education?.map((edu: any) =>
        [
          edu.degree,
          edu.institution_name,
          edu.start_date && edu.end_date
            ? `(${edu.start_date} - ${edu.end_date})`
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      ) ?? [],

    reviews: [],
    reviewsList: [],
  };
};

export const mapClientProfile = (apiData: any): ClientProfileData => {
  const user = apiData?.user ?? apiData ?? {};

  return {
    name: user.username?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    city: user.city ?? "",
    country: user.country ?? "",
    image: user.image || "/default.png",
  };
};
