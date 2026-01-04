import { ProfileData } from "@/types/profile";

export const mapConsultantProfile = (apiData: any): ProfileData => {
  const user = apiData?.user ?? {};
  const consultant = apiData?.consultant ?? apiData ?? {};

  return {
    name: user.username?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? "",
    title: consultant.clients_summary ?? "",
    description: consultant.clients_summary ?? "",
    email: user.email ?? "",
    location: `${user.city ?? ""}, ${user.country ?? ""}`.replace(
      /^, |, $/g,
      ""
    ),

    module: consultant.user.module ?? {core: "N/A", others: "N/A"},
    projects: consultant.projects_count ?? 0,
    availability: consultant.weekly_available_hours
      ? `${consultant.weekly_available_hours} hrs/week`
      : "N/A",
    rate: consultant.rate ? `$${consultant.rate}/hour` : "N/A",
    experience: consultant.experience
      ? `${consultant.experience} Years`
      : "N/A",
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
