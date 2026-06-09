"use client";

import {
  MapPin,
  Calendar,
  CheckCircle2,
  Zap,
  Star,
  CircleStar,
  FileText,
  ChevronUp,
  ChevronDown,
  Clock,
  CircleCheck,
  Dot,
  Laptop,
  Plus,
  Sparkles,
  Award,
  Linkedin,
} from "lucide-react";
import { Badge } from "../homepage/ui/badge";
import { useAppSelector } from "@/lib/store/hook";
import { useState } from "react";
import { Separator } from "../homepage/ui/separator";
import { Button } from "../homepage/ui/button";
import UserInfo from "./userInfo";
import CoreModules from "./coreModules";
import ProfileSpecification from "./profile-specification";

interface ProfileHeaderProps {
  name: string;
  headline?: string;
  badges?: string[];
  isCertified?: boolean;
  rate: number;
  location: string;
  joinDate?: string;
  projectsDone?: number;
  coreModules?: string[];
}

// const badgeConfig = {
//   VERIFIED: { label: 'Verified', variant: 'bg-success' as const, startIcon: <CheckCircle2 className="w-3 h-3" /> },
//   CERTIFIED: { label: 'Certified', variant: 'bg-brand-blue' as const, startIcon: <Star className="w-3 h-3" /> },
//   SENIOR_EXPERT: { label: 'Senior Expert', variant: 'bg-brand-blue' as const, startIcon: <CircleStar className="w-3 h-3" /> },
// }
const badgeConfig = {
  VERIFIED: {
    label: "Verified",
    variant: "bg-success" as const,
    startIcon: CheckCircle2,
  },
  CERTIFIED: {
    label: "Certified",
    variant: "bg-brand-blue" as const,
    startIcon: Star,
  },
  JUNIOR: {
    label: "Junior Consultant",
    variant: "bg-gray-100" as const,
    startIcon: Award,
  },
  ASSOCIATE: {
    label: "Associate Consultant",
    variant: "bg-brand-blue" as const,
    startIcon: Star,
  },
  MID_LEVEL: {
    label: "Mid Level",
    variant: "bg-indigo-100" as const,
    startIcon: Star,
  },
  SENIOR: {
    label: "Senior Consultant",
    variant: "bg-purple-100" as const,
    startIcon: CircleStar,
  },
  PRINCIPAL: {
    label: "Principal Consultant",
    variant: "bg-amber-100" as const,
    startIcon: Star,
  },
  SOLUTION_ARCHITECT: {
    label: "Solution Architect",
    variant: "bg-brand-blue" as const,
    startIcon: Sparkles,
  },
};

export function ProfileHeader({
  onEnterEdit,
}: {
  onEnterEdit: (opts?: { scrollToClientsSummary?: boolean }) => void;
}) {
  const [viewMore, setViewMore] = useState(false);
  const user = useAppSelector((state) => state?.user?.user);
  const summaryHtml = user?.clients_summary || "";
  const summaryText = summaryHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const shouldShowSummaryToggle = summaryText.length > 250;
  const badges: string[] = user?.badges || [];
  const coreModules: string[] =
    user?.user?.modules
      ?.filter((module: any) => module?.is_primary)
      ?.map((module: any) => module?.module?.name) || [];

  return (
    <div className="flex-1 flex flex-col gap-3 md:mt-0 mt-4">
      <div className="md:block hidden">
        <UserInfo
          user={user?.user}
          badges={badges}
        />
        <CoreModules coreModules={coreModules} />
        <ProfileSpecification user={user} />
      </div>

    <div className="md:order-2 order-3">
      {coreModules.length > 0 ? (
        <div className="bg-gradient-success md:h-14 h-auto border mb-4 border-slate-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex md:flex-row flex-col md:items-center items-start gap-2 font-manrope">
              <div className="flex items-center mr-1">
                <Dot className="w-8 h-8 text-success" />
                <p className="text-sm text-success font-medium">
                  Core Modules
                </p>
              </div>
              <div className="h-5 w-[1px] bg-slate-200 md:block hidden"></div>
              <div className="flex items-center gap-2">
                {coreModules.map((module, index) => (
                  <div
                    key={module}
                    className={`flex items-center font-semibold gap-2 ${index !== 0 ? "bg-white" : "bg-success"} rounded-md px-4 py-1.5 ${index !== 0 ? "text-success" : "text-white"}`}
                  >
                    <p className="text-xs font-semibold font-manrope">
                      {module}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-inactive border border-dashed mb-4 border-slate-200 rounded-xl px-4 py-3 flex items-center gap-2">
          <div className="flex items-center gap-2 bg-disabled rounded-xl p-2">
            <Laptop className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 flex-1 font-manrope">
            <p className="font-manrope text-sm text-slate-500">
              No core modules selected
            </p>
            <p className="text-xs text-slate-300">
              Add your primary SAP specialization - e.g S/4HANA, FI/CO
            </p>
          </div>
        </div>
      )}
    </div>

      <div className="md:order-3 order-2">
        {user?.clients_summary && user?.clients_summary !== '<p></p>' ? (
          <div className="mb-4 bg-background-main md:bg-[#F5F3EF] border border-slate-200 rounded-lg p-4">
            <p className="font-bold mb-4 flex items-center gap-2 font-manrope text-sm">
              <span className="bg-brand-blue text-white rounded-md p-1 w-6 h-6 flex items-center justify-center font-manrope">
                <FileText className="w-4 h-4" />
              </span>
              Professional Summary
            </p>
            <div
              className="text-[12px] text-slate-600 mb-4 leading-relaxed font-manrope max-w-full overflow-hidden [&_*]:max-w-full [&_*]:break-words [&_ul]:list-disc [&_ul]:pl-3 [&_ol]:list-decimal [&_ol]:pl-3 [&_li]:mb-1"
              style={
                !viewMore
                  ? {
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }
                  : {
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }
              }
              dangerouslySetInnerHTML={{ __html: summaryHtml }}
            />
            {shouldShowSummaryToggle && (
              <button
                type="button"
                className="text-brand-blue text-sm font-medium flex items-center gap-2"
                onClick={() => setViewMore(!viewMore)}
              >
                {viewMore ? (
                  <ChevronUp className="w-4 h-4 text-black" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-black text-xxs" />
                )}{" "}
                {viewMore ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-inactive border border-dashed mb-4 border-slate-200 rounded-xl px-4 py-3 flex flex-col text-center justify-center items-center gap-2">
            <div className="flex items-center gap-2 bg-disabled rounded-xl p-2">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex flex-col justify-center items-center gap-1 flex-1">
              <p className="font-bold font-manrope text-sm text-slate-500">
                No professional summary yet
              </p>
              <p className="text-xs font-manrope text-slate-300 max-w-md">
                Tell clients about your expertise, experience, and what makes you
                stand out. A strong summary increases your chances of being hired
                by 3×.
              </p>
              <Button
                type="button"
                onClick={() =>
                  onEnterEdit({ scrollToClientsSummary: true })
                }
                className="bg-white w-fit flex items-center gap-1 px-4 py-2 rounded-xl text-xs border border-slate-300 text-brand-blue"
              >
                <Plus className="w-4 h-4 text-black" /> Write Summary
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
