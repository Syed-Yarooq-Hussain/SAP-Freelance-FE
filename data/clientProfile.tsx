import { IFieldConfig } from "@/components/CreateForm";

export const clientProfileData = {
  profile: {
    name: "Aria Winters",
    title:
      "Experienced SAP SD Consultant with 8+ years in global rollouts, specializing in supply chain optimization and client onboarding. Rated 4.9★ by clients.",
    module: "SAP SD, S/4HANA",
    experience: "8 yrs",
    projects: 2,
    availability: "20 hrs/week",
    rate: "$20/hour",
    rating: "4.9★ (Top 5%)",
    location: "Germany",
    contact: "john.doe@example.com",
    visibility: "All clients",
    image: "/default.png",
  },
  skills: [
    "SAP SD, S/4HANA",
    "Order-to-Cash",
    "S/4HANA",
    "Integration",
    "Client Onboarding",
    "ABAP (basic)",
  ],

  experienceList: [
    {
      title: "Global Rollout - Manufacturing",
      client: "ManuCorp",
      role: "Lead Consultant",
      duration: "14 months",
      technologies: "SAP SD, S/4HANA",
    },
    {
      title: "Retail Implementation",
      client: "RetailCo",
      role: "SD Stream Lead",
      duration: "8 months",
      technologies: "SAP SD, Fiori",
    },
    {
      title: "Supply Chain Optimization",
      client: "LogiCo",
      role: "Team Lead",
      duration: "12 months",
      technologies: "SAP SCM, S/4HANA",
    },
  ],

  education: [
    "SAP Certified Application Associate – SAP S/4HANA Sales (2020)",
    "MSc, Technical University Munich (2015)",
  ],
  reviews: [
    {
      client: "ManuCorp",
      rating: 5,
      comment: "Excellent work on SD implementation!",
    },
    {
      client: "RetailCo",
      rating: 4.5,
      comment: "Excellent work on SD implementation!",
    },
    {
      client: "LogiCo",
      rating: 4.8,
      comment: "Excellent work on SD implementation!",
    },
  ],
};

export const profileElements: IFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Your Name",
    column: { xs: 12, md: 4 },
    rules: { required: "End date is required" },
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "Your Location",
    column: { xs: 12, md: 4 },
    rules: { required: "End date is required" },
  },
  {
    name: "module",
    label: "Module",
    type: "text",
    placeholder: "Your Module",
    column: { xs: 12, md: 4 },
    rules: { required: "End date is required" },
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Your Email",
    column: { xs: 12, md: 4 },
    rules: { required: "End date is required" },
  },
  {
    name: "rate",
    label: "Hourly Rate",
    type: "text",
    placeholder: "Your Hourly Rate",
    column: { xs: 12, md: 4 },
    rules: { required: "End date is required" },
  },
  {
    name: "experience",
    label: "Experience (Years)",
    type: "number",
    placeholder: "Your Experience",
    column: { xs: 12, md: 4 },
    rules: { required: "End date is required" },
  }
];

export const profileBottomElements: IFieldConfig[] = [
  {
    name: "visibility",
    label: "Visibility",
    type: "select",
    placeholder: "Your Visiblity",
    column: { xs: 12, md: 6 },
    rules: { required: "End date is required" },
    options: [
      { label: "Public", value: "public" },
      { label: "Private", value: "private" },
    ],
  },
  {
    name: "weeklyHours",
    label: "Weekly Hours",
    type: "select",
    placeholder: "Your Weekly Hours",
    column: { xs: 12, md: 6 },
    rules: { required: "End date is required" },
    options: [
      { label: "10 Hours", value: "10" },
      { label: "20 Hours", value: "20" },
      { label: "30 Hours", value: "30" },
      { label: "40 Hours", value: "40" },
    ],
  },
  {
    name: "description",
    label: "Bio",
    placeholder: "Your Bio Description",
    type: "textarea",
  },
]

export const profileExtraElements: IFieldConfig[] = [
  {
    name: "projectName",
    label: "Project name",
    type: "text",
    placeholder: "Project Name",
    column: { xs: 12, md: 4 },
    rules: { required: "Project name is required" },
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    placeholder: "Your Role",
    column: { xs: 12, md: 4 },
    rules: { required: "Role is required" },
    options: [
      { label: "Developer", value: "Developer" },
      { label: "Designer", value: "Designer" },
      { label: "Manager", value: "Manager" },
      { label: "Tester", value: "Tester" },
    ],
  },
  {
    name: "modules",
    label: "Modules",
    type: "text",
    placeholder: "Your Modules",
    column: { xs: 12, md: 4 },
  },
  {
    name: "client",
    label: "Client",
    type: "text",
    placeholder: "Your Client",
    column: { xs: 12, md: 4 },
  },
  {
    name: "duration",
    label: "Duration",
    type: "select",
    placeholder: "Your Duration",
    column: { xs: 12, md: 4 },
    rules: { required: "Duration is required" },
    options: [
      { label: "1 Month", value: "1 Month" },
      { label: "2 Month", value: "2 Month" },
      { label: "3 Month", value: "3 Month" },
      { label: "4 Month", value: "4 Month" },
      { label: "5 Month", value: "5 Month" },
      { label: "6 Month", value: "6 Month" },
      { label: "7 Month", value: "7 Month" },
      { label: "8 Month", value: "8 Month" },
      { label: "9 Month", value: "9 Month" },
      { label: "10 Month", value: "10 Month" },
      { label: "11 Month", value: "11 Month" },
      { label: "12 Month", value: "12 Month" },
    ],
  },
  {
    name: "startDate",
    label: "Start date",
    type: "date",
    placeholder: "Your Start Date",
    column: { xs: 12, md: 4 },
    rules: { required: "Start date is required" },
  },
];

export const projectFormElement: { label: string; value: string }[] = [
  { label: "SAP SD, S/4HANA", value: "SAP SD, S/4HANA" },
  { label: "Order-to-Cash", value: "Order-to-Cash" },
  { label: "S/4HANA", value: "S/4HANA" },
  { label: "Integration", value: "Integration" },
  { label: "Client Onboarding", value: "Client Onboarding" },
  { label: "ABAP (basic)", value: "ABAP (basic)" },
];
