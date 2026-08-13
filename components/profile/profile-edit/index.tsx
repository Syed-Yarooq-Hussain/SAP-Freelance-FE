"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  type FieldErrors,
  type FieldPath,
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
  ArrowRight,
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
import { useSapModules, useSapOtherModules } from "@/actions/common/useSapModules";
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
import { getIndustries } from "@/services/getIndustries";
import { getExpertiseLevels } from "@/services/getExpertiseLevel";
import { useToast } from "@/providers/ToastProvider";
import { LocationAutocomplete } from "@/components/account-settings/LocationAutocomplete";
import { toast } from "sonner";
import ReactQuill from "react-quill-new";
import SapModulesDropdown from "./SapModulesDropdown";

const headlineEditorModules = {
  toolbar: [["bold", "italic", "underline"], [{ list: "bullet" }], ["clean"]],
};

const headlineEditorFormats = ["bold", "italic", "underline", "list"];

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

/** Flatten react-hook-form / yup error tree for logging and user feedback */
function flattenFormErrors(
  obj: Record<string, unknown> | null | undefined,
  prefix = "",
): { path: string; message: string }[] {
  if (!obj || typeof obj !== "object") return [];
  const list: { path: string; message: string }[] = [];
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${key}` : key;
    if (val && typeof val === "object") {
      const msg = (val as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim()) {
        list.push({ path, message: msg });
        continue;
      }
      if (Array.isArray(val)) {
        val.forEach((item, i) => {
          if (item && typeof item === "object") {
            list.push(
              ...flattenFormErrors(item as Record<string, unknown>, `${path}.${i}`),
            );
          }
        });
      } else {
        list.push(...flattenFormErrors(val as Record<string, unknown>, path));
      }
    }
  }
  return list;
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
    s === "completed" ? "Completed" : s === "paused" ? "Paused" : "Active";
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
      <span>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {optional && (
        <span className="text-xs text-light-grey ml-1">Optional</span>
      )}
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

export default function ProfileEditPage({
  goBack,
  scrollToClientsSummary = false,
}: {
  goBack: () => void;
  /** When true on mount (e.g. from “Write Summary”), expand Basic Information and scroll to the headline editor */
  scrollToClientsSummary?: boolean;
}) {
  const dispatch = useAppDispatch();
  const { user: consultant } = useAppSelector((state) => state.user);
  const [industries, setIndustries] = useState<any[]>([]);
  const [expertiseLevels, setExpertiseLevels] = useState<any[]>([]);
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
    basicInfo: false,
    myInformation: true,
    keyLocations: false,
    contactAndLocation: true,
    professionalSummary: false,
    professionalInformation: false,
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
    setFocus,
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

  const onInvalidSubmit = useCallback(
    (formErrors: FieldErrors<ProfileEditFormData>) => {
      const flat = flattenFormErrors(formErrors as unknown as Record<string, unknown>);
      console.error("[ProfileEdit] validation failed", {
        errorCount: flat.length,
        fields: flat,
        rawErrors: formErrors,
      });
      if (flat.length === 0) {
        toast.error("Unable to save. Check the form for invalid values.", {
          description: "Open the browser console for details.",
        });
        return;
      }
      const description = flat
        .slice(0, 10)
        .map((f) => `• ${f.message}`)
        .join("\n");
      const extra =
        flat.length > 10 ? `\n… and ${flat.length - 10} more` : "";
      toast.error("Please fill all the mandtory fields", {
        description: `${description}${extra}`,
        duration: 12_000,
      });
      const first = flat[0]?.path;
      if (first) {
        try {
          setFocus(first as FieldPath<ProfileEditFormData>);
        } catch {
          /* field may not be registered */
        }
      }
    },
    [setFocus],
  );

  const handleClientsSummaryChange = useCallback(
    (value: string) => {
      setValue("clients_summary", value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  useEffect(() => {
    reset(buildProfileEditDefaults(consultant));
  }, [consultant, reset]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  useEffect(() => {
    getIndustries().then((industries) => {
      setIndustries(industries);
    });
  }, []);

  useEffect(() => {
    getExpertiseLevels().then((expertiseLevels) => {
      setExpertiseLevels(expertiseLevels);
    });
  }, []);

  const clientsSummaryScrollDoneRef = useRef(false);

  useEffect(() => {
    if (!scrollToClientsSummary) {
      clientsSummaryScrollDoneRef.current = false;
      return;
    }
    setExpandedSections((prev) => ({ ...prev, keyLocations: true }));
  }, [scrollToClientsSummary]);

  useEffect(() => {
    if (
      !scrollToClientsSummary ||
      !expandedSections.keyLocations ||
      clientsSummaryScrollDoneRef.current
    ) {
      return;
    }
    const scroll = () => {
      const el = document.getElementById("profile-edit-clients-summary");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        clientsSummaryScrollDoneRef.current = true;
      }
    };
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(scroll);
    });
    return () => cancelAnimationFrame(frame);
  }, [scrollToClientsSummary, expandedSections.keyLocations]);

  // console.log(industries, expertiseLevels,'levellll');

  const cvUrl = watch("cv_url");
  const coreModules = watch("core");
  const otherModules = watch("others");
  const weeklyAvailableHours = watch("weekly_available_hours");
  const usernameW = watch("username");
  const emailW = watch("email");
  const { data: sapModulesData } = useSapModules();
  const { data: sapOtherModulesData } = useSapOtherModules();
  const modules: any = sapModulesData?.data;
  const serverAvatar = sanitizeUrl(nestedUser?.avatar);
  const headerAvatarSrc = photoPreview || serverAvatar;
  const headerInitial =
    (usernameW || nestedUser?.username || "?").trim().charAt(0).toUpperCase() ||
    "?";
  const hasWeeklyAvailabilityChanged = useMemo(() => {
    const initial = defaultValues.weekly_available_hours;
    const current = weeklyAvailableHours;
    const isBlank = (value: unknown) =>
      value === null || value === undefined || String(value).trim() === "";

    if (isBlank(initial)) {
      return !isBlank(current);
    }

    return Number(initial) !== Number(current);
  }, [defaultValues.weekly_available_hours, weeklyAvailableHours]);

  // const handlePhotoSelected = async (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const file = e.target.files?.[0];
  //   e.target.value = "";
  //   if (!file) return;
  //   if (file.size > 5 * 1024 * 1024) {
  //     alert("File is too large. Maximum size is 5 MB.");
  //     return;
  //   }
  //   const allowed = ["image/jpeg", "image/png", "image/webp"];
  //   if (!allowed.includes(file.type)) {
  //     alert("Please use JPG, PNG, or WebP.");
  //     return;
  //   }
  //   if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
  //   const blobUrl = URL.createObjectURL(file);
  //   setPhotoPreview(blobUrl);

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     const result = await request<FormData, { url: string }>({
  //       url: `/consultants/upload-profile/${nestedUser?.id}`,
  //       method: "POST",
  //       data: formData,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     if (sanitizeUrl(result?.data?.url)) {
  //       const consultantData = await getConsultantMeService();
  //       if (consultantData?.data)
  //         dispatch(updateUser({ user: consultantData.data }));
  //       setPhotoPreview((prev) => {
  //         if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
  //         return null;
  //       });
  //     }
  //   } catch {
  //     // keep blob preview so the user can retry
  //   }
  // };

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
  const [workEditingIndex, setWorkEditingIndex] = useState<number | null>(null);
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
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

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
        linkedin_url: data.linkedin_url ?? "", // ✅ belongs on USER
      },
      consultant: {
        rate: data.rate ?? null,
        experience: data.experience != null ? Number(data.experience) : null,
        expertise_level: data.expertise_level ?? "",
        industries: data.industries ?? "",
        weekly_available_hours: data.weekly_available_hours ?? null,
        professional_headline: (
          data.professional_headline ||
          data.clients_summary ||
          ""
        ).trim(),
        clients_summary: data.clients_summary ?? "",

        // ✅ fixed key names to match backend
        core_module: Array.isArray(data.core) ? data.core : [],
        other_module: Array.isArray(data.others) ? data.others : [],

        work_experiences: Array.isArray(data.work_experiences)
          ? data.work_experiences
          : [],

        // ✅ fixed key names to match backend
        certification: Array.isArray(data.certifications)
          ? data.certifications
          : [],
        education: Array.isArray(data.educations) ? data.educations : [],

        projects: Array.isArray(data.projects) ? data.projects : [],
      },
    };

    try {
      const res = await updateConsultantProfile(
        consultant?.id,
        payloadToSend as any,
      );

      if (res.status === "success") {
        const consultantData = await getConsultantMeService();
        if (consultantData?.data) {
          dispatch(updateUser({ user: consultantData.data }));
        }
        toast.success("Profile updated successfully!");
        goBack();
      } else {
        toast.error("Failed to update profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
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
      <div className="flex items-start md:items-center gap-3">
        {icon && <div className="bg-[#EAF1FB] text-start p-2 rounded-xl">{icon}</div>}
        <div className="font-manrope flex flex-col gap-0.5 items-start">
          <h2 className="text-sm text-left font-manrope text-black">{title}</h2>
          {description && (
            <p className="text-xs text-left font-manrope text-light-grey">
              {description}
            </p>
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
    <div className="min-h-screen bg-[#F0EDE8EB] pb-28 font-manrope md:bg-white md:pb-12">
      {/* Header */}
      <div className="sticky top-0 md:top-14 z-20 border-b border-slate-200 bg-transparent md:bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-transparent  md:supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center">
              <div
                onClick={goBack}
                className="w-10 h-10 bg-background-main rounded-xl border border-slate-200 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </div>
            </div>
            <div>
              <h1 className="text-base md:text-2xl font-neue text-slate-900">
                Setup Your Profile
              </h1>
              <p className="text-xs md:text-sm font-manrope text-light-grey">
                Keep your profile accurate to attract the right clients
              </p>
            </div>
          </div>
          <div className="md:flex hidden items-center gap-2">
            <button
              onClick={goBack}
              className="px-6 py-2 text-sm bg-background-main border border-slate-200 text-black rounded-xl transition font-medium hover:bg-slate-100"
            >
              Discard Changes
            </button>
            <button
              onClick={() => setSaveConfirmOpen(true)}
              className="px-6 py-2 text-sm bg-brand-blue text-white rounded-xl transition font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 w-full gap-3 mt-4 px-4">
        <div className="col-span-full md:col-span-2">
          <ProfileAvatarUpload />
        </div>
        <div className="md:col-span-6 col-span-full">
          <form
            onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
            className="flex flex-col gap-2"
          >
            {/* My Information */}
            <div className="rounded-box border border-slate-200 overflow-hidden bg-background-main">
              <SectionHeader
                icon={<User className="w-5 h-5 text-slate-600" />}
                title="Profile Essentials"
                description="Basic profile, contact details, location, and SAP expertise"
                section="myInformation"
              />
              {expandedSections.myInformation && (
                <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-6">
                  {/* <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-600" />
                    <h3 className="text-sm font-semibold text-slate-800">Basic Information</h3>
                  </div> */}
                  {/* First and Last Name */}
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
                        <p className="text-xs text-light-grey mt-2">
                          Set your preferred hourly rate range. Clients see this
                          when browsing your profile.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col items-start gap-2 mt-4">
                        <div className="w-full">
                          <InputField
                            label="Weekly availability (hours)"
                            type="number"
                            required
                            className="w-full"
                            error={errors.weekly_available_hours?.message}
                            {...register("weekly_available_hours")}
                          />
                        </div>
                        <p className="text-xs text-start text-light-grey">Note: Changing weekly availability will reset your calendar availability. </p>
                      </div>
                    </div>
                  </div>

                  <div className=" flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                        Core Modules
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <SapModulesDropdown
                        data={sapOtherModulesData?.data || []}
                        values={coreModules || []}
                        maxSelections={2}
                        allowModuleRequest
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
                      />
                      <p className="text-xs text-light-grey mt-2">
                        Only 2 modules allowed.{" "}
                      </p>
                      {errors.core && (
                        <p className="text-xs text-red-500 mt-2">
                          {errors.core.message}
                        </p>
                      )}
                    </div>

                    <div className=" flex flex-col gap-4">
                      {/* <div>
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
                    </div> */}

                      <div>
                        <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                          Other Modules
                        </label>
                        {/* <MultiSelect
                          options={
                            modules?.others?.length > 0
                              ? modules.others.map((module: any) => ({
                                  label: module.name,
                                  value: String(module.id),
                                }))
                              : []
                          }
                          value={otherModules || []}
                          onChange={(selected) => {
                            setValue("others", selected, {
                              shouldValidate: true,
                            });
                          }}
                          placeholder="Select other modules"
                        /> */}
                        <SapModulesDropdown
                          data={sapOtherModulesData?.data || []}
                          values={otherModules || []}
                          allowModuleRequest
                          onChange={(selected) => {
                            setValue("others", selected, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:hidden grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                        Country
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <LocationAutocomplete
                        value={watch("country") || ""}
                        onChange={(value) => {
                          setValue("country", value, { shouldValidate: true })
                          setValue("city", "", { shouldValidate: true })
                        }}
                        placeholder="Select country"
                        className="bg-brand-yellow"
                        type="country"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                        City
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <LocationAutocomplete
                        value={watch("city") || ""}
                        onChange={(value) => {
                          setValue("city", value, { shouldValidate: true })
                        }}
                        placeholder="Select city"
                        className="bg-brand-yellow"
                        type="city"
                        selectedCountry={watch("country") || ""}
                      />
                    </div>
                  </div>
                  <div className="md:grid hidden grid-cols-1 md:grid-cols-2 gap-4">
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
                    {/* <LocationAutocomplete
                      value={watch('country') || ''}
                      onChange={(value) => setValue('country', value)}
                      placeholder="Select country"
                      className="bg-brand-yellow"
                    /> */}

                    {/* <div className="col-span-full">
                      <InputField
                        name="linkedin_url"
                        label="LinkedIn URL"
                        type="text"
                        value={watch("linkedin_url") || ""}
                        error={errors.linkedin_url?.message}
                        onChange={(e: any) =>
                          setValue("linkedin_url", e.target.value)
                        }
                      />
                    </div> */}
                  </div>

                  {/* <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Full Name"
                      type="text"
                      required
                      error={errors.username?.message}
                      {...register("username")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                      Professional Headline
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <ReactQuill className="bg-brand-yellow rounded-lg" style={{borderRadius: '10px'}} theme="snow" value={watch("clients_summary") || ''} onChange={(value) => {
                        console.log("clients_summary", value)
                        setValue("clients_summary", value)
                      }} />
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
                  </div> */}

                  {/* Years of Experience and Expertise Level */}
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      name="experience"
                      label="Years of Experience"
                      type="number"
                      required
                      value={watch("experience") || ""}
                      error={errors.experience?.message}
                      onChange={(e: any) =>
                        setValue("experience", Number(e.target.value))
                      }
                    />

                    <SelectField
                      label="Expertise Level"
                      required
                      placeholder="Select level"
                      error={errors.expertise_level?.message}
                      options={
                        expertiseLevels?.length > 0
                          ? expertiseLevels.map((level: any) => ({
                              label: level,
                              value: level,
                            }))
                          : []
                      }
                      {...register("expertise_level")}
                    />
                  </div> */}

                  {/* Industry Focus */}
                  <div>
                    <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                      Industry Focus
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <MultiSelect
                      options={
                        industries?.length > 0
                          ? industries?.map((industry: any) => ({
                              label: industry.name,
                              value: String(industry.id),
                            }))
                          : []
                      }
                      value={
                        typeof watch("industries") === "string" &&
                        watch("industries")?.trim()
                          ? watch("industries")!
                              .split(",")
                              .map((v) => v.trim())
                              .filter(Boolean)
                          : []
                      }
                      onChange={(selected) => {
                        clearErrors("industries");
                        setValue("industries", selected.join(","), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      placeholder="Select industry focus"
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
              <SectionHeader
                icon={<Folder className="w-5 h-5 text-slate-600" />}
                title="Basic Information"
                description="Your key details — Keep it clear and concise"
                section="keyLocations"
              />
              {expandedSections.keyLocations && (
                <div className="px-6 py-4 border-t border-slate-200 bg-background-main space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                      <div className="grid grid-cols-1 gap-4">
                        <InputField
                          label="Full Name"
                          type="text"
                          required
                          error={errors.username?.message}
                          {...register("username")}
                        />
                      </div>

                      <div className="col-span-1">
                        <InputField
                          name="linkedin_url"
                          label="LinkedIn URL"
                          type="text"
                          value={watch("linkedin_url") || ""}
                          error={errors.linkedin_url?.message}
                          onChange={(e: any) =>
                            setValue("linkedin_url", e.target.value)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 col-span-full gap-4">
                        <InputField
                          name="experience"
                          label="Experience (in years)"
                          type="number"
                          required
                          value={watch("experience") || ""}
                          error={errors.experience?.message}
                          onChange={(e: any) =>
                            setValue("experience", Number(e.target.value))
                          }
                        />

                        <SelectField
                          label="Expertise Level"
                          required
                          placeholder="Select level"
                          error={errors.expertise_level?.message}
                          options={
                            expertiseLevels?.length > 0
                              ? expertiseLevels.map((level: any) => ({
                                  label: level,
                                  value: level,
                                }))
                              : []
                          }
                          {...register("expertise_level")}
                        />
                      </div>
                    </div>
                    {/* <InputField
                      name="linkedin_url"
                      label="LinkedIn URL"
                      type="text"
                      value={watch("linkedin_url") || ''}
                      error={errors.linkedin_url?.message}
                      onChange={(e: any) => setValue("linkedin_url", e.target.value)}
                    /> */}
                    <p className="text-xs border border-slate-200 flex items-center gap-2 text-brand-blue bg-[#EAF1FB] p-2 rounded-xl">
                      <Info className="w-4 h-4 text-black" /> Mention your SAP
                      specialisation, years of experience, key industries and
                      outcomes. Use numbers — e.g. &quot;reduced close cycle by
                      60%&quot;. Max 500 characters.
                    </p>
                    <div
                      id="profile-edit-clients-summary"
                      className="scroll-mt-28"
                    >
                      <label className="block text-xs font-manrope font-medium text-slate-700 mb-2">
                        Professional Headline
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <ReactQuill
                          className="profile-headline-editor bg-brand-yellow rounded-lg"
                          style={{ borderRadius: "10px" }}
                          theme="snow"
                          modules={headlineEditorModules}
                          formats={headlineEditorFormats}
                          value={watch("clients_summary") || ""}
                          onChange={handleClientsSummaryChange}
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          This appears right below your name - keep it punchy
                          and specific
                        </p>
                        <div className="absolute top-2 right-3 text-xs text-slate-500">
                          {watch("clients_summary")?.length || 0}
                        </div>
                      </div>
                      {errors.clients_summary?.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.clients_summary?.message}
                        </p>
                      )}
                    </div>
                    {/* <textarea
                      {...register("professional_headline")}
                      placeholder="e.g. Experienced SAP S/4HANA Finance & Controlling consultant with 5 years of hands-on delivery across EMEA. Specialising in end-to-end FI/CO implementations for mid-to-large enterprises, I bridge the gap between business finance teams and technical SAP landscapes. Proven track record in digital transformation, reducing close cycles and improving reporting visibility."
                      className={`w-full bg-brand-yellow p-3 border text-sm text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3088B7] resize-none ${errors.clients_summary?.message ? "border-red-500" : "border-slate-300"}`}
                      rows={5}
                    /> */}
                  </div>
                </div>
              )}
            </div>

            {/* Professional Information */}
            <div className="rounded-box border border-slate-200 overflow-hidden bg-white">
              <SectionHeader
                icon={<Briefcase className="w-5 h-5 text-slate-600" />}
                title="Professional Information"
                description="Work experience, education, projects, and certifications"
                section="professionalInformation"
              />
              {expandedSections.professionalInformation && (
                <div className="px-6 py-5 border-t border-slate-200 bg-background-main space-y-6">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-600" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Work Experience
                    </h3>
                  </div>
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
                            <div className="flex md:flex-row flex-col shrink-0 gap-2">
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

                  <div className="h-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-600" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Education
                    </h3>
                  </div>
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
                            <div className="flex md:flex-row flex-col shrink-0 gap-2">
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

                  <div className="h-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-slate-600" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Projects
                    </h3>
                  </div>
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
                            <div className="flex md:flex-row flex-col shrink-0 gap-2">
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

                  <div className="h-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-slate-600" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Certifications
                    </h3>
                  </div>
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
                            <div className="flex md:flex-row flex-col shrink-0 gap-2">
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

            <div className="pointer-events-none fixed inset-x-0 bottom-14 z-30 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
              <div className="pointer-events-auto flex w-full max-w-lg items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-light-grey transition hover:bg-slate-50"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => setSaveConfirmOpen(true)}
                  className="flex items-center justify-center gap-1 flex-1 rounded-xl bg-brand-blue py-2.5 text-sm font-medium text-white transition hover:opacity-95"
                >
                  Save Changes <ArrowRight className="w-4 h-4" />
                </button>
              </div>
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
            <ConfirmDeleteModal
              isOpen={saveConfirmOpen}
              title={
                hasWeeklyAvailabilityChanged
                  ? "Update weekly availability?"
                  : "Save changes"
              }
              message={
                hasWeeklyAvailabilityChanged
                  ? "Changing weekly availability will reset your calendar availability. Existing calendar slots may need to be set again. Are you sure you want to continue?"
                  : "Are you sure you want to save these profile changes?"
              }
              confirmLabel={
                hasWeeklyAvailabilityChanged ? "Yes, update" : "Save"
              }
              cancelLabel="Cancel"
              variant="primary"
              onCancel={() => {
                if (hasWeeklyAvailabilityChanged) {
                  setValue(
                    "weekly_available_hours",
                    defaultValues.weekly_available_hours,
                    { shouldValidate: true, shouldDirty: true },
                  );
                }
                setSaveConfirmOpen(false);
              }}
              onConfirm={() => {
                void handleSubmit(
                  (data) => {
                    setSaveConfirmOpen(false);
                    return onSubmit(data);
                  },
                  onInvalidSubmit,
                )();
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
