export type ProfileExperience = ProfileData["experienceList"][number];

export interface ConsultantProfileData {
  name: string;
  title: string;
  email: string;
  location: string;
  module: any;
  projects: string | number;
  availability: string;
  rate: string;
  experience: string | number;
  rating: string;
  visibility: string;
  description: string;
  image: string;
  skills: string[];
  certifications: string;

  education: string[];
  experienceList: Array<{
    title: string;
    client: string;
    role: string;
    duration: string;
    technologies: string;
  }>;

  reviews: Array<{
    client: string;
    rating: number;
    comment: string;
  }>;

  reviewsList: Array<{
    client: string;
    rating: number;
    comment: string;
  }>;
}

export interface ClientProfileData {
  name: string;
  email: string;
  city: string;
  country: string;
  phone: string;
  image: string;
}
