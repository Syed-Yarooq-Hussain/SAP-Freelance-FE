"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  profileEditSchema,
  buildProfileEditDefaults,
  type ProfileEditFormData,
} from "@/lib/schemas/profile-edit";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import { updateUser } from "@/lib/store/features/user/userSlice";
import { getConsultantMeService } from "@/services/getConsultantProfile";
import { request } from "@/utils/request";
import { sanitizeUrl } from "@/utils/common";
import {
  AlignLeft,
  Award,
  Briefcase,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Edit,
  Folder,
  FolderKanban,
  GraduationCap,
  Info,
  LaptopMinimal,
  MapPin,
  Plus,
  Star,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProfileAvatarUpload } from "./profile-avatar-upload";
import { MultiSelect } from "@/components/homepage/ui/multi-select";
import { useSapModules } from "@/actions/common/useSapModules";
import { WorkExperienceModal } from "@/components/profile/work-experience-modal";
import { CertificationModal } from "@/components/profile/certification-modal";
import { EducationModal } from "@/components/profile/education-modal";
import { ProjectsModal } from "@/components/profile/projects-modal";
import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import type { WorkExperienceFormData } from "@/lib/schemas/experience";
import type { CertificationFormData } from "@/lib/schemas/certification";
import type { EducationFormData } from "@/lib/schemas/education";
import type { ProjectFormData } from "@/lib/schemas/projects";
import { updateConsultantProfile } from "@/services/consultants";
import { useToast } from "@/providers/ToastProvider";
import { LocationAutocomplete } from "@/components/account-settings/LocationAutocomplete";

const inputSurfaceClass =
  "bg-background-main border-slate-200 focus:ring-[#3088B7] focus:border-[#3088B7]";

function formatMonthYearForCard(value?: string | null) {
  if (!value) return "";
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "current" || normalized === "present") return "Present";
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }
  return String(value);
}

function formatDateRange(start?: string | null, end?: string | null) {
  const left = start?.trim() ? formatMonthYearForCard(start) : "";
  const right =
    end != null && String(end).trim() !== ""
      ? formatMonthYearForCard(end)
      : "Present";
  if (!left) {
    return right === "Present" ? "" : right;
  }
  return `${left} – ${right}`;
}

function mapModalProjectToProfileRow(
  data: ProjectFormData,
  existing?: ProfileEditFormData["projects"][number],
): ProfileEditFormData["projects"][number] {
  const raw = data as ProjectFormData & {
    budget?: number | null | "";
    status?: string;
  };
  const s = String(raw.status || "active").toLowerCase();
  const status =
    s === "completed"
      ? "Completed"
      : s === "paused"
        ? "Paused"
        : "Active";
  const budgetRaw = raw.budget;
  const budget =
    budgetRaw === "" || budgetRaw === null || budgetRaw === undefined
      ? null
      : Number(budgetRaw);
  return {
    id: existing?.id,
    project_name: data.project_name || "",
    client_name: data.client_name || "",
    project_summary: data.project_summary || "",
    start_date: data.start_date || "",
    end_date: data.end_date || "",
    budget: Number.isNaN(budget as number) ? null : budget,
    status,
  };
}

function mapProfileProjectToModal(
  row: ProfileEditFormData["projects"][number],
): ProjectFormData & { budget?: number | null; status?: string } {
  return {
    project_name: row.project_name || "",
    client_name: row.client_name || "",
    project_summary: row.project_summary || "",
    start_date: row.start_date || "",
    end_date: row.end_date || "",
    budget: row.budget ?? null,
    status: (row.status || "Active").toLowerCase(),
  } as ProjectFormData & { budget?: number | null; status?: string };
}

const InputField = ({
  label,
  type = "text",
  required = false,
  optional = false,
  error,
  placeholder = "",
  ...rest
}: any) => (
  <div>
    <label className="flex text-xs font-manrope font-medium text-slate-700 mb-2 items-center justify-between">
      <span> {label} </span>
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && <span className="text-xs text-light-grey ml-1">Optional</span>}
    </label>
    <input
      type={type}
      {...rest}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      className={`${rest?.disabled ? "text-slate-500" : "text-black"} bg-brand-yellow w-full px-4 py-2.5 border rounded-xl font-manrope text-sm focus:outline-none focus:ring-2 focus:ring-[#3088B7] ${error ? "border-red-500" : "border-slate-300"}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  required = false,
  error,
  options = [],
  placeholder = "Select option",
  ...rest
}: any) => (
  <div>
    <label className="flex text-xs font-manrope font-medium text-slate-700 mb-2 items-center justify-between">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      {...rest}
      className={`w-full bg-brand-yellow px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3088B7] ${error ? "border-red-500" : "border-slate-300"}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option: { label: string; value: string }) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function ProfileEditPage({ goBack }: { goBack: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { user: consultant } = useAppSelector((state) => state.user);

  const defaultValues = useMemo(
    () => buildProfileEditDefaults(consultant),
    [consultant],
  );
  const nestedUser = (
    consultant as {
      user?: { id?: number; avatar?: string; username?: string };
    } | null
  )?.user;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    basicInfo: false ,
    keyLocations: false,
    contactAndLocation: true,
    professionalSummary: false,
    experience: false,
    workExperience: false,
    certifications: false,
    education: false,
    projects: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
    setValue,
    setError,
    clearErrors,
  } = useForm<ProfileEditFormData>({
    resolver: yupResolver(profileEditSchema) as Resolver<ProfileEditFormData>,
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    reset(buildProfileEditDefaults(consultant));
  }, [consultant, reset]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const cvUrl = watch("cv_url");
  const coreModules = watch("core");
  const otherModules = watch("others");
  const usernameW = watch("username");
  const emailW = watch("email");
  const { data: sapModulesData } = useSapModules();
  const modules: any = sapModulesData?.data;
  const serverAvatar = sanitizeUrl(nestedUser?.avatar);
  const headerAvatarSrc = photoPreview || serverAvatar;
  const headerInitial =
    (usernameW || nestedUser?.username || "?").trim().charAt(0).toUpperCase() ||
    "?";

  const handlePhotoSelected = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5 MB.");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Please use JPG, PNG, or WebP.");
      return;
    }
    if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    const blobUrl = URL.createObjectURL(file);
    setPhotoPreview(blobUrl);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await request<FormData, { url: string }>({
        url: `/consultants/upload-profile/${nestedUser?.id}`,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (sanitizeUrl(result?.data?.url)) {
        const consultantData = await getConsultantMeService();
        if (consultantData?.data)
          dispatch(updateUser({ user: consultantData.data }));
        setPhotoPreview((prev) => {
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          return null;
        });
      }
    } catch {
      // keep blob preview so the user can retry
    }
  };

  const clearLocalPhotoPreview = () => {
    if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDiscard = () => {
    clearLocalPhotoPreview();
    reset(buildProfileEditDefaults(consultant));
  };

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
    update: updateWork,
  } = useFieldArray({
    control,
    name: "work_experiences",
  });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
    update: updateCert,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
    update: updateEdu,
  } = useFieldArray({
    control,
    name: "educations",
  });

  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
    update: updateProj,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const workExperiences = watch("work_experiences");
  const certificationsList = watch("certifications");
  const educationsList = watch("educations");
  const projectsList = watch("projects");

  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [workEditingIndex, setWorkEditingIndex] = useState<number | null>(
    null,
  );
  const [workEditingData, setWorkEditingData] = useState<
    WorkExperienceFormData | undefined
  >();
  const [workDeleteOpen, setWorkDeleteOpen] = useState(false);
  const [workDeleteIndex, setWorkDeleteIndex] = useState<number | null>(null);

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certEditingIndex, setCertEditingIndex] = useState<number | null>(null);
  const [certEditingData, setCertEditingData] = useState<
    CertificationFormData | undefined
  >();
  const [certDeleteOpen, setCertDeleteOpen] = useState(false);
  const [certDeleteIndex, setCertDeleteIndex] = useState<number | null>(null);

  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [eduEditingIndex, setEduEditingIndex] = useState<number | null>(null);
  const [eduEditingData, setEduEditingData] = useState<
    EducationFormData | undefined
  >();
  const [eduDeleteOpen, setEduDeleteOpen] = useState(false);
  const [eduDeleteIndex, setEduDeleteIndex] = useState<number | null>(null);

  const [projModalOpen, setProjModalOpen] = useState(false);
  const [projEditingIndex, setProjEditingIndex] = useState<number | null>(null);
  const [projEditingData, setProjEditingData] = useState<
    (ProjectFormData & { budget?: number | null; status?: string }) | undefined
  >();
  const [projDeleteOpen, setProjDeleteOpen] = useState(false);
  const [projDeleteIndex, setProjDeleteIndex] = useState<number | null>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const openWorkAdd = () => {
    setWorkEditingIndex(null);
    setWorkEditingData(undefined);
    setWorkModalOpen(true);
  };

  const openWorkEdit = (index: number) => {
    const row = workExperiences?.[index];
    if (!row) return;
    setWorkEditingIndex(index);
    setWorkEditingData({
      company_name: row.company_name || "",
      position: row.position || "",
      start_date: row.start_date || "",
      end_date: row.end_date || "",
      responsibilities: Array.isArray(row.responsibilities)
        ? row.responsibilities
        : [],
    });
    setWorkModalOpen(true);
  };

  const handleWorkSave = async (data: WorkExperienceFormData) => {
    const existing =
      workEditingIndex !== null
        ? workExperiences?.[workEditingIndex]
        : undefined;
    const row = {
      company_name: data.company_name ?? "",
      position: data.position ?? "",
      start_date: data.start_date ?? "",
      end_date: data.end_date ?? "",
      responsibilities: data.responsibilities || [],
    };
    if (workEditingIndex !== null) {
      updateWork(workEditingIndex, row as any);
    } else {
      appendWork(row as any);
    }
  };

  const openCertAdd = () => {
    setCertEditingIndex(null);
    setCertEditingData(undefined);
    setCertModalOpen(true);
  };

  const openCertEdit = (index: number) => {
    const row = certificationsList?.[index];
    if (!row) return;
    setCertEditingIndex(index);
    setCertEditingData({
      certification_name: row.certification_name || "",
      issuing_organization: row.issuing_organization || "",
      issue_date: row.issue_date || "",
      expiration_date: row.expiration_date || "",
    });
    setCertModalOpen(true);
  };

  const handleCertSave = async (data: CertificationFormData) => {
    const existing =
      certEditingIndex !== null
        ? certificationsList?.[certEditingIndex]
        : undefined;
    const row = {
      certification_name: data.certification_name ?? "",
      issuing_organization: data.issuing_organization ?? "",
      issue_date: data.issue_date ?? "",
      expiration_date: data.expiration_date ?? "",
    };
    if (certEditingIndex !== null) {
      updateCert(certEditingIndex, row as any);
    } else {
      appendCert(row as any);
    }
  };

  const openEduAdd = () => {
    setEduEditingIndex(null);
    setEduEditingData(undefined);
    setEduModalOpen(true);
  };

  const openEduEdit = (index: number) => {
    const row = educationsList?.[index];
    if (!row) return;
    setEduEditingIndex(index);
    setEduEditingData({
      institution_name: row.institution_name || "",
      degree: row.degree || "",
      start_date: row.start_date || "",
      end_date: row.end_date || "",
      details: Array.isArray(row.details) ? row.details : [],
    });
    setEduModalOpen(true);
  };

  const handleEduSave = async (data: EducationFormData) => {
    const existing =
      eduEditingIndex !== null ? educationsList?.[eduEditingIndex] : undefined;
    const row = {
      institution_name: data.institution_name ?? "",
      degree: data.degree ?? "",
      start_date: data.start_date ?? "",
      end_date: data.end_date ?? "",
      details: data.details || [],
    };
    if (eduEditingIndex !== null) {
      updateEdu(eduEditingIndex, row as any);
    } else {
      appendEdu(row as any);
    }
  };

  const openProjAdd = () => {
    setProjEditingIndex(null);
    setProjEditingData(undefined);
    setProjModalOpen(true);
  };

  const openProjEdit = (index: number) => {
    const row = projectsList?.[index];
    if (!row) return;
    setProjEditingIndex(index);
    setProjEditingData(mapProfileProjectToModal(row));
    setProjModalOpen(true);
  };

  const handleProjSave = async (data: ProjectFormData) => {
    const existing =
      projEditingIndex !== null ? projectsList?.[projEditingIndex] : undefined;
    const row = mapModalProjectToProfileRow(data, existing);
    if (projEditingIndex !== null) {
      updateProj(projEditingIndex, row as any);
    } else {
      appendProj(row as any);
    }
  };

  const onSubmit: SubmitHandler<ProfileEditFormData> = async (data) => {
    const payloadToSend = {
      user: {
        username: data.username ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        city: data.city ?? "",
        country: data.country ?? "",
        linkedin_url: data.linkedin_url ?? "",  // ✅ belongs on USER
      },
      consultant: {
        rate: data.rate ?? null,
        experience: data.experience != null ? Number(data.experience) : null,
        expertise_level: data.expertise_level ?? "",
        industries: data.industries ?? "",
        weekly_available_hours: data.weekly_available_hours ?? null,
        professional_headline: (data.professional_headline || data.clients_summary || "").trim(),
        clients_summary: data.clients_summary ?? "",
        
        // ✅ fixed key names to match backend
        core_module: Array.isArray(data.core) ? data.core : [],
        other_module: Array.isArray(data.others) ? data.others : [],
        
        work_experiences: Array.isArray(data.work_experiences) ? data.work_experiences : [],
        
        // ✅ fixed key names to match backend
        certification: Array.isArray(data.certifications) ? data.certifications : [],
        education: Array.isArray(data.educations) ? data.educations : [],
        
        projects: Array.isArray(data.projects) ? data.projects : [],
      },
    };

    try {
      
      const res = await updateConsultantProfile(consultant?.id, payloadToSend as any)

      if (res.status === 'success') {
        const consultantData = await getConsultantMeService()
        if (consultantData?.data) {
          dispatch(updateUser({ user: consultantData.data }))
        }
        toast.toast("Profile updated successfully!", "success");
      } else {
        toast.toast("Failed to update profile!", "error");
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  };


  const TextAreaField = ({ label, required = false, error, ...rest }: any) => (
    <div>
      <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...rest}
        className={`w-full px-3 py-2 border rounded-xl font-manrope focus:outline-none focus:ring-2 focus:ring-[#3088B7] ${error ? "border-red-500" : "border-slate-300"} resize-none`}
        rows={4}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const SectionHeader = ({
    title,
    description,
    icon,
    section,
  }: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    section: keyof typeof expandedSections;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full bg-background-main px-6 py-4 flex items-center justify-between hover:bg-slate-100/80 transition"
    >
      <div className="flex items-center gap-3">
        {icon && <div className="bg-[#EAF1FB] p-2 rounded-xl">{icon}</div>}
        <div className="font-manrope flex flex-col gap-0.5 items-start">
          <h2 className="text-sm font-manrope text-black">{title}</h2>
          {description && (
            <p className="text-xs font-manrope text-light-grey">{description}</p>
          )}
        </div>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-slate-600" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-white  pb-12 font-manrope">
      {/* Header */}
      <div className="bg-[#FFFFFF]  sticky top-0 z-10">
        <div className="mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div onClick={goBack} className="w-10 h-10 bg-background-main rounded-xl border border-slate-200 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-black" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-neue text-slate-900">Setup Your Profile</h1>
              <p className="text-sm font-manrope text-light-grey">Keep your profile accurate to attract the right clients</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              className="px-6 py-2 text-sm bg-background-main border border-slate-200 text-black rounded-xl hover:scale-105 transition font-medium"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="px-6 py-2 text-sm bg-brand-blue text-white rounded-xl hover:bg-[#0891B2] transition font-medium hover:scale-105" 
            >
              Save Changes
            </button>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 w-full gap-3 mt-4 px-4">
        <div className="col-span-2">
          <ProfileAvatarUpload />
        </div>
        <div className="col-span-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            {/* Contant and location Information */}
            <div className="rounded-box border border-slate-200 overflow-hidden bg-background-main">
              <SectionHeader
                icon={<MapPin className="w-5 h-5 text-slate-600" />}
                title="Contact & location"
                description="Where you are and how to reach you"
                section="contactAndLocation"
              />
              {expandedSections.contactAndLocation && (
                <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-6">
                  {/* First and Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Email Address"
                      type="text"
                      disabled
                      required
                      cl
                      error={errors.email?.message}
                      {...register("email")}
                    />
                    <InputField
                      label="Phone Number"
                      type="text"
                      optional
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-4">
                  {/* <InputField
                      label="Country"
                      type="text"
                      required
                      error={errors.country?.message}
                      {...register("country")}
                    />
                    <InputField
                      label="City"
                      type="text"
                      required
                      error={errors.city?.message}
                      {...register("city")}
                    /> */}
                    <LocationAutocomplete
                      value={watch('country') || ''}
                      onChange={(value) => setValue('country', value)}
                      placeholder="Select country"
                      className="bg-brand-yellow"
                    />
                    <LocationAutocomplete
                      value={watch('city') || ''}
                      onChange={(value) => setValue('city', value)}
                      placeholder="Select city"
                      className="bg-brand-yellow"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-full">
                      <InputField
                        label="Hourly Rate (USD)"
                        type="number"
                        required
                        className="w-full"
                        error={errors.rate?.message}
                          {...register("rate")}
                        />
                        <p className="text-xs text-light-grey mt-2">Set your preferred hourly rate range. Clients see this when browsing your profile.</p>

                        </div>
                      {/* <span className="text-slate-500 mt-4 text-2xl">-</span> */}
                      {/* <div className="w-full">
                      <InputField
                        label="Maximum"
                        type="number"
                        required
                        error={errors.rate?.message}
                        {...register("rate")}
                      />
                      </div> */}
                    </div>
                  <div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-full">
                      <InputField
                        label="Weekly Availability"
                        type="number"
                        required
                        className="w-full"
                        error={errors.weekly_available_hours?.message}
                          {...register("weekly_available_hours")}
                        />
                        </div>
                      {/* <span className="text-slate-500 mt-4 text-2xl">-</span> */}
                      {/* <div className="w-full">
                      <InputField
                        label="Maximum"
                        type="number"
                        required
                        error={errors.rate?.message}
                        {...register("rate")}
                      />
                      </div> */}
                    </div>
                  </div>
                  </div>

                </div>
              )}
            </div>
            {/* Professional Summary */}
            <div className="rounded-box border border-slate-200 overflow-hidden bg-background-main">
              <SectionHeader
                title="Expertise & SAP Modules"
                description="Your core module, skills, and certifications"
                icon={<LaptopMinimal className="w-5 h-5 text-slate-600" />}
                section="professionalSummary"
              />
              {expandedSections.professionalSummary && (
                <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-4">
                  <div className=" flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                        Core Modules
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <MultiSelect
                        options={
                          modules?.core?.length > 0
                            ? modules.core.map((module: any) => ({
                                label: module.name,
                                value: String(module.id),
                              }))
                            : []
                        }
                        value={coreModules || []}
                        onChange={(selected) => {
                          if (selected.length > 2) {
                            setError("core", {
                              type: "manual",
                              message: "You can select maximum 2 items",
                            });
                            return;
                          }

                          clearErrors("core");
                          setValue("core", selected, { shouldValidate: true });
                        }}
                        placeholder="Select core modules"
                      />
                      <p className="text-xs text-light-grey mt-2">Only 2 modules allowed. </p>
                      {errors.core && (
                        <p className="text-xs text-red-500 mt-2">
                          {errors.core.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                        Other Modules
                      </label>
                      <MultiSelect
                        options={
                          modules?.others?.length > 0
                            ? modules.others.map((module: any) => ({
                                label: module.name,
                                value: String(module.id),
                              }))
                            : []
                        }
                        value={otherModules || []}
                        onChange={(selected) =>{
                          setValue("others", selected, { shouldValidate: true })
                        }}
                        placeholder="Select other modules"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Basic Information */}
            <div className="rounded-box border border-slate-200 overflow-hidden bg-background-main">
              <SectionHeader
                icon={<User className="w-5 h-5 text-slate-600" />}
                title="Basic Information"
                description="Your name, headline, and professional identity"
                section="basicInfo"
              />
              {expandedSections.basicInfo && (
                <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-6">
                  {/* First and Last Name */}
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Full Name"
                      type="text"
                      required
                      error={errors.username?.message}
                      {...register("username")}
                    />
                  </div>

                  {/* Professional Headline */}
                  <div>
                    <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                      Professional Headline
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        {...register("clients_summary")}
                        placeholder="e.g., SAP S/4HANA Consultant · Finance & Controlling · 5 yrs exp"
                        className={`w-full bg-brand-yellow text-sm px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3088B7] resize-none ${errors.clients_summary?.message ? "border-red-500" : "border-slate-300"}`}
                        rows={1}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        This appears right below your name - keep it punchy and
                        specific
                      </p>
                      <div className="absolute top-2 right-3 text-xs text-slate-500">
                        {watch("clients_summary")?.length || 0} / 100
                      </div>
                    </div>
                    {errors.clients_summary?.message && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.clients_summary?.message}
                      </p>
                    )}
                  </div>

                  {/* Years of Experience and Expertise Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      name="experience"
                      label="Years of Experience"
                      type="number"
                      required
                      value={watch("experience") || ''}
                      error={errors.experience?.message}
                      onChange={(e: any) => setValue("experience", Number(e.target.value))}
                    />

                    <SelectField
                      label="Expertise Level"
                      required
                      placeholder="Select level"
                      error={errors.expertise_level?.message}
                      options={[
                        { label: "Beginner", value: "Beginner" },
                        { label: "Intermediate", value: "Intermediate" },
                        { label: "Advanced", value: "Advanced" },
                        { label: "Expert", value: "Expert" },
                      ]}
                      {...register("expertise_level")}
                    />
                  </div>

                  {/* Industry Focus */}
                  <div>
                    
                    <InputField
                      name="industries"
                      label="Industry Focus"
                      type="text"
                      optional={true}
                      value={watch("industries") || ''}
                      error={errors.industries?.message}
                      onChange={(e: any) => setValue("industries", e.target.value)}
                     />
                    <p className="text-xs text-slate-500 mt-1">
                      Separate multiple industries with commas
                    </p>
                    {errors.industries?.message && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.industries?.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Professional Summary */}
            <div className="rounded-box border border-slate-200 overflow-hidden bg-background-main">
              <SectionHeader icon={<Folder className="w-5 h-5 text-slate-600" />} title="Professional Summary" description="Your elevator pitch - Keep it focused and compelling" section="keyLocations" />
              {expandedSections.keyLocations && (
                <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-4">
                  <div className="flex flex-col gap-4">
                    <InputField
                      name="linkedin_url"
                      label="LinkedIn URL"
                      type="text"
                      value={watch("linkedin_url") || ''}
                      error={errors.linkedin_url?.message}
                      onChange={(e: any) => setValue("linkedin_url", e.target.value)}
                    />
                    <p className="text-xs border border-slate-200 flex items-center gap-2 text-brand-blue bg-[#EAF1FB] p-2 rounded-xl">
                      <Info className="w-4 h-4 text-black" /> Mention your SAP specialisation, years of experience, key industries and outcomes. Use numbers — e.g. &quot;reduced close cycle by 60%&quot;. Max 500 characters.
                    </p>
                    <textarea
                      {...register("professional_headline")}
                      placeholder="e.g. Experienced SAP S/4HANA Finance & Controlling consultant with 5 years of hands-on delivery across EMEA. Specialising in end-to-end FI/CO implementations for mid-to-large enterprises, I bridge the gap between business finance teams and technical SAP landscapes. Proven track record in digital transformation, reducing close cycles and improving reporting visibility."
                      className={`w-full bg-brand-yellow p-3 border text-sm text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3088B7] resize-none ${errors.clients_summary?.message ? "border-red-500" : "border-slate-300"}`}
                      rows={5}
                    />
                  </div>
                </div>
              )}
            </div>

            

            {/* Work Experience */}
            <div className="rounded-box border border-slate-200 overflow-hidden bg-white">
              <SectionHeader
                icon={<Briefcase className="w-5 h-5 text-slate-600" />}
                title="Work Experience"
                description="Your consulting history and previous roles"
                section="workExperience"
              />
              {expandedSections.workExperience && (
                <div className="px-6 py-5 border-t border-slate-200 bg-background-main space-y-4">
                  {workFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-brand-yellow rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-600 text-sm mb-4">
                        No work experience added yet
                      </p>
                      <button
                        type="button"
                        onClick={openWorkAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#3088B7] text-white text-xs font-semibold rounded-xl"
                      >
                        <Plus className="w-3 h-3" />
                        Add Work Experience
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {workFields.map((field, index) => {
                        const item = workExperiences?.[index];
                        return (
                          <div
                            key={field.id}
                            className="bg-brand-yellow border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                {item?.position || "—"}
                              </p>
                              <p className="text-xs text-brand-blue mt-0.5">
                                {item?.company_name || "—"}
                              </p>
                              <p className="text-xs text-slate-600 mt-2">
                                {formatDateRange(
                                  item?.start_date,
                                  item?.end_date,
                                )}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                onClick={() => openWorkEdit(index)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                aria-label="Edit work experience"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setWorkDeleteIndex(index);
                                  setWorkDeleteOpen(true);
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                aria-label="Delete work experience"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {workFields.length > 0 ? (
                    <button
                      type="button"
                      onClick={openWorkAdd}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-slate-400 hover:text-slate-600 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Work Experience
                    </button>
                  ) : null}
                </div>
              )}
            </div>

           

            {/* Education */}
            <div className="rounded-box border border-slate-200 overflow-hidden bg-white">
              <SectionHeader
                icon={<GraduationCap className="w-5 h-5 text-slate-600" />}
                title="Education"
                description="Degrees, institutions, and academic background"
                section="education"
              />
              {expandedSections.education && (
                <div className="px-6 py-5 border-t border-slate-200 bg-background-main space-y-4">
                  {eduFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-brand-yellow rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-600 text-sm mb-4">
                        No education added yet
                      </p>
                      <button
                        type="button"
                        onClick={openEduAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#3088B7] text-white text-xs font-semibold rounded-xl"
                      >
                        <Plus className="w-3 h-3" />
                        Add Education
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {eduFields.map((field, index) => {
                        const item = educationsList?.[index];
                        return (
                          <div
                            key={field.id}
                            className="bg-brand-yellow border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                {item?.degree || "—"}
                              </p>
                              <p className="text-xs text-brand-blue mt-0.5">
                                {item?.institution_name || "—"}
                              </p>
                              <p className="text-xs text-slate-600 mt-2">
                                {formatDateRange(
                                  item?.start_date,
                                  item?.end_date,
                                )}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                onClick={() => openEduEdit(index)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                aria-label="Edit education"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEduDeleteIndex(index);
                                  setEduDeleteOpen(true);
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                aria-label="Delete education"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {eduFields.length > 0 ? (
                    <button
                      type="button"
                      onClick={openEduAdd}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-slate-400 hover:text-slate-600 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Education
                    </button>
                  ) : null}
                </div>
              )}
            </div>

            {/* Projects */}
            <div className="rounded-box border border-slate-200 overflow-hidden bg-white">
              <SectionHeader
                icon={<FolderKanban className="w-5 h-5 text-slate-600" />}
                title="Projects"
                description="Notable client work and delivery highlights"
                section="projects"
              />
              {expandedSections.projects && (
                <div className="px-6 py-5 border-t border-slate-200 bg-background-main space-y-4">
                  {projFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-brand-yellow rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-600 text-sm mb-4">
                        No projects added yet
                      </p>
                      <button
                        type="button"
                        onClick={openProjAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#3088B7] text-white text-xs font-semibold rounded-xl"
                      >
                        <Plus className="w-3 h-3" />
                        Add Project
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projFields.map((field, index) => {
                        const item = projectsList?.[index];
                        return (
                          <div
                            key={field.id}
                            className="bg-brand-yellow border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                {item?.project_name || "—"}
                              </p>
                              <p className="text-xs text-brand-blue mt-0.5">
                                {item?.client_name || "—"}
                              </p>
                              <p className="text-xs text-slate-600 mt-2">
                                {formatDateRange(
                                  item?.start_date,
                                  item?.end_date,
                                )}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                onClick={() => openProjEdit(index)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                aria-label="Edit project"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setProjDeleteIndex(index);
                                  setProjDeleteOpen(true);
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                aria-label="Delete project"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {projFields.length > 0 ? (
                    <button
                      type="button"
                      onClick={openProjAdd}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-slate-400 hover:text-slate-600 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  ) : null}
                </div>
              )}
            </div>

             {/* Certifications */}
             <div className="rounded-box border border-slate-200 overflow-hidden bg-white">
              <SectionHeader
                icon={<Star className="w-5 h-5 text-slate-600" />}
                title="Certifications"
                description="Professional credentials and SAP certifications"
                section="certifications"
              />
              {expandedSections.certifications && (
                <div className="px-6 py-5 border-t border-slate-200 bg-background-main space-y-4">
                  {certFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-brand-yellow rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-600 text-sm mb-4">
                        No certifications added yet
                      </p>
                      <button
                        type="button"
                        onClick={openCertAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#3088B7] text-white text-xs font-semibold rounded-xl"
                      >
                        <Plus className="w-3 h-3" />
                        Add Certification
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {certFields.map((field, index) => {
                        const item = certificationsList?.[index];
                        return (
                          <div
                            key={field.id}
                            className="bg-brand-yellow border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                {item?.certification_name || "—"}
                              </p>
                              <p className="text-xs text-brand-blue mt-0.5">
                                {item?.issuing_organization || "—"}
                              </p>
                              <p className="text-xs text-slate-600 mt-2">
                                {formatDateRange(
                                  item?.issue_date,
                                  item?.expiration_date,
                                )}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button
                                type="button"
                                onClick={() => openCertEdit(index)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                aria-label="Edit certification"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCertDeleteIndex(index);
                                  setCertDeleteOpen(true);
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                aria-label="Delete certification"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {certFields.length > 0 ? (
                    <button
                      type="button"
                      onClick={openCertAdd}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-slate-400 hover:text-slate-600 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Certification
                    </button>
                  ) : null}
                </div>
              )}
            </div>

            <WorkExperienceModal
              isOpen={workModalOpen}
              onClose={() => {
                setWorkModalOpen(false);
                setWorkEditingIndex(null);
                setWorkEditingData(undefined);
              }}
              onSave={handleWorkSave}
              initialData={workEditingData}
            />
            <CertificationModal
              isOpen={certModalOpen}
              onClose={() => {
                setCertModalOpen(false);
                setCertEditingIndex(null);
                setCertEditingData(undefined);
              }}
              onSave={handleCertSave}
              initialData={certEditingData}
            />
            <EducationModal
              isOpen={eduModalOpen}
              onClose={() => {
                setEduModalOpen(false);
                setEduEditingIndex(null);
                setEduEditingData(undefined);
              }}
              onSave={handleEduSave}
              initialData={eduEditingData}
            />
            <ProjectsModal
              isOpen={projModalOpen}
              onClose={() => {
                setProjModalOpen(false);
                setProjEditingIndex(null);
                setProjEditingData(undefined);
              }}
              onSave={handleProjSave}
              initialData={projEditingData}
            />

            <ConfirmDeleteModal
              isOpen={workDeleteOpen}
              message="Are you sure you want to delete this experience?"
              onCancel={() => {
                setWorkDeleteOpen(false);
                setWorkDeleteIndex(null);
              }}
              onConfirm={() => {
                if (workDeleteIndex !== null) removeWork(workDeleteIndex);
                setWorkDeleteOpen(false);
                setWorkDeleteIndex(null);
              }}
            />
            <ConfirmDeleteModal
              isOpen={certDeleteOpen}
              message="Are you sure you want to delete this certification?"
              onCancel={() => {
                setCertDeleteOpen(false);
                setCertDeleteIndex(null);
              }}
              onConfirm={() => {
                if (certDeleteIndex !== null) removeCert(certDeleteIndex);
                setCertDeleteOpen(false);
                setCertDeleteIndex(null);
              }}
            />
            <ConfirmDeleteModal
              isOpen={eduDeleteOpen}
              message="Are you sure you want to delete this education?"
              onCancel={() => {
                setEduDeleteOpen(false);
                setEduDeleteIndex(null);
              }}
              onConfirm={() => {
                if (eduDeleteIndex !== null) removeEdu(eduDeleteIndex);
                setEduDeleteOpen(false);
                setEduDeleteIndex(null);
              }}
            />
            <ConfirmDeleteModal
              isOpen={projDeleteOpen}
              message="Are you sure you want to delete this project?"
              onCancel={() => {
                setProjDeleteOpen(false);
                setProjDeleteIndex(null);
              }}
              onConfirm={() => {
                if (projDeleteIndex !== null) removeProj(projDeleteIndex);
                setProjDeleteOpen(false);
                setProjDeleteIndex(null);
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
