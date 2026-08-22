"use client";

import {
  Award,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  CircleCheck,
  Clock,
  Dot,
  FileText,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { useState } from "react";

type Tab = "projects" | "certifications" | "work-experience" | "education";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "work-experience", label: "Work Experience" },
  { id: "education", label: "Education" },
];

const formatMonth = (value?: string | null) => {
  if (!value) return "Present";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export default function AdminConsultantProfileView({ profile }: { profile: any }) {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const user = profile?.user ?? {};
  const modules = Array.isArray(user?.modules) ? user.modules : [];
  const coreModules = modules.filter((item: any) => item?.is_primary);
  const otherModules = modules.filter((item: any) => !item?.is_primary);
  const badges: string[] = Array.isArray(profile?.badges) ? profile.badges : [];
  const projects = Array.isArray(profile?.projects) ? profile.projects : [];
  const work = Array.isArray(profile?.work_experiences) ? profile.work_experiences : [];
  const education = Array.isArray(profile?.education) ? profile.education : [];
  const certifications = Array.isArray(profile?.certification) ? profile.certification : [];

  return (
    <div className="min-h-screen bg-background-main">
      <div className="mb-4 rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="shrink-0 md:w-56">
            <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-inactive p-3 shadow-2xl md:h-56 md:w-56">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.username || "Consultant"} className="h-full w-full rounded-3xl object-cover" />
              ) : (
                <span className="text-5xl font-bold text-slate-400">{String(user?.username || "C").slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <div className="mt-4 space-y-2 rounded-xl p-3 text-black">
              <Contact icon={Mail} value={user?.email || "-"} />
              <Contact icon={Phone} value={user?.phone || "-"} />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl text-slate-900 font-neue md:text-3xl">{user?.username || `Consultant #${profile?.id}`}</h1>
              {badges.map((badge) => (
                <span key={badge} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white ${badge === "VERIFIED" ? "bg-success" : "bg-brand-blue"}`}>
                  {badge === "VERIFIED" ? <CheckCircle2 className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                  {badge.replaceAll("_", " ")}
                </span>
              ))}
            </div>

            <div className={`mb-4 grid grid-cols-2 gap-4 ${user?.linkedin_url ? "md:grid-cols-5" : "md:grid-cols-4"}`}>
              <Spec label="Hourly Rate" value={`$${profile?.rate ?? 0} USD / hr`} />
              <Spec label="Availability (Weekly)" value={`${profile?.weekly_available_hours ?? 0} hours`} icon={Clock} />
              <Spec label="Location" value={[user?.city, user?.country].filter(Boolean).join(", ") || "-"} icon={MapPin} />
              <Spec label="Projects" value={`${projects.length} done`} icon={CircleCheck} />
              {user?.linkedin_url ? <Spec label="LinkedIn" value="View Profile" icon={Linkedin} href={user.linkedin_url} /> : null}
            </div>

            {coreModules.length ? (
              <div className="mb-4 rounded-xl border border-slate-200 bg-gradient-success px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center text-success"><Dot className="h-8 w-8" /><span className="text-sm font-medium">Core Modules</span></div>
                  {coreModules.map((item: any, index: number) => (
                    <span key={item?.id ?? index} className="rounded-md bg-success px-4 py-1.5 text-xs font-semibold text-white">{item?.module?.name}</span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-lg border border-slate-200 bg-[#F5F3EF] p-4">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-blue text-white"><FileText className="h-4 w-4" /></span>Professional Summary</h2>
              <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">{profile?.clients_summary || profile?.professional_headline || "No professional summary added."}</p>
            </div>
          </main>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <aside className="lg:col-span-1">
          <section className="mb-4 rounded-xl border border-slate-200 px-3 py-4">
            <h2 className="mb-4 flex items-center text-sm text-slate-900"><Dot className="h-8 w-8" />Other Modules</h2>
            <div className="flex flex-wrap gap-2">
              {otherModules.length ? otherModules.map((item: any, index: number) => (
                <span key={item?.id ?? index} className="rounded-lg border border-brand-blue/20 bg-[#EAF1FB] px-3 py-1.5 text-[11px] font-medium text-brand-blue">{item?.module?.name}</span>
              )) : <Empty label="No other modules added" />}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-bold text-slate-900">Additional Information</h2>
            <Info label="Experience" value={`${profile?.experience ?? 0} years`} />
            <Info label="Skills" value={Array.isArray(profile?.skills) && profile.skills.length ? profile.skills.join(", ") : "-"} />
            <Info label="Timezone" value={user?.timezone || "-"} />
            <Info label="CV" value={profile?.cv_url ? "Available" : "Not uploaded"} />
          </section>
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 font-syne"><span className="rounded-xl bg-[#EAF1FB] p-2"><Briefcase className="h-4 w-4" /></span>Professional Information</h2>
          <div className="mb-3 flex gap-2 overflow-x-auto rounded-xl bg-brand-yellow p-2">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium ${activeTab === tab.id ? "bg-white shadow-md" : "text-black"}`}>{tab.label}</button>
            ))}
          </div>

          {activeTab === "projects" ? <ProjectList rows={projects} /> : null}
          {activeTab === "work-experience" ? <WorkList rows={work} /> : null}
          {activeTab === "education" ? <EducationList rows={education} /> : null}
          {activeTab === "certifications" ? <CertificationList rows={certifications} /> : null}
        </section>
      </div>
    </div>
  );
}

function Contact({ icon: Icon, value }: { icon: any; value: string }) { return <p className="flex items-center gap-2 break-all rounded-lg px-2 py-3 text-xs shadow-custom"><Icon className="h-4 w-4 shrink-0" />{value}</p>; }
function Spec({ label, value, icon: Icon, href }: { label: string; value: string; icon?: any; href?: string }) { const body = <div className="flex items-center gap-1.5 text-sm text-slate-900">{Icon ? <Icon className="h-4 w-4" /> : null}{value}</div>; return <div className="flex min-h-16 flex-col justify-evenly rounded-lg border border-slate-200 px-4 py-2 shadow-custom"><p className="text-[10px] font-semibold text-light-grey">{label}</p>{href ? <a href={href} target="_blank" rel="noreferrer" className="text-brand-blue">{body}</a> : body}</div>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="mb-3 border-b border-slate-100 pb-3 last:mb-0 last:border-0 last:pb-0"><p className="text-[10px] font-semibold uppercase text-slate-400">{label}</p><p className="mt-1 break-words text-xs text-slate-700">{value}</p></div>; }
function Empty({ label }: { label: string }) { return <div className="w-full rounded-xl border border-dashed border-slate-300 bg-brand-yellow py-10 text-center text-sm text-slate-500">{label}</div>; }
function Card({ children }: { children: React.ReactNode }) { return <article className="rounded-xl border border-slate-200 bg-brand-yellow p-4">{children}</article>; }
function Dates({ start, end }: { start?: string | null; end?: string | null }) { return <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><CalendarDays className="h-3 w-3" />{formatMonth(start)} – {formatMonth(end)}</p>; }
function ProjectList({ rows }: { rows: any[] }) { return rows.length ? <div className="space-y-4">{rows.map((item, index) => <Card key={index}><h3 className="text-sm font-semibold text-slate-900 font-syne">{item.project_name || "-"}</h3><p className="mt-1 text-xs text-brand-blue">{item.client_name || "-"}</p><p className="mt-3 whitespace-pre-line text-xs leading-6 text-slate-600">{item.project_summary || item.summary || "-"}</p><Dates start={item.start_date} end={item.end_date} /></Card>)}</div> : <Empty label="No projects added" />; }
function WorkList({ rows }: { rows: any[] }) { return rows.length ? <div className="space-y-4">{rows.map((item, index) => <Card key={index}><h3 className="text-sm font-semibold text-slate-900 font-syne">{item.position || "-"}</h3><p className="mt-1 text-xs text-brand-blue">{item.company_name || "-"}</p><Dates start={item.start_date} end={item.end_date} />{Array.isArray(item.responsibilities) ? <ul className="mt-3 space-y-1 text-xs text-slate-600">{item.responsibilities.map((value: string, i: number) => <li key={i}>• {value}</li>)}</ul> : null}</Card>)}</div> : <Empty label="No work experience added" />; }
function EducationList({ rows }: { rows: any[] }) { return rows.length ? <div className="space-y-4">{rows.map((item, index) => <Card key={index}><h3 className="text-sm font-semibold text-slate-900 font-syne">{item.degree || "-"}</h3><p className="mt-1 text-xs text-brand-blue">{item.institution_name || "-"}</p><Dates start={item.start_date} end={item.end_date} /></Card>)}</div> : <Empty label="No education added" />; }
function CertificationList({ rows }: { rows: any[] }) { return rows.length ? <div className="space-y-4">{rows.map((item, index) => <Card key={index}><h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 font-syne"><Award className="h-4 w-4 text-brand-blue" />{item.certification_name || "-"}</h3><p className="mt-1 text-xs text-brand-blue">{item.issuing_organization || "-"}</p><Dates start={item.issue_date} end={item.expiration_date} /></Card>)}</div> : <Empty label="No certifications added" />; }
