'use client'

import { useAppSelector } from "@/lib/store/hook"
import { Dot } from "lucide-react"

export function OtherModulesSection() {
  const user = useAppSelector((state: any) => state?.user?.user)
  const otherModules: string[] = user?.user?.modules?.filter((module: any) => !module?.is_primary)?.map((module: any) => module?.module?.name) || []

  return (
    <div className=" rounded-xl border mb-4 border-slate-200 px-2 py-3">
      <h3 className="text-xs border-t border-slate-200 pt-1 text-slate-900 mb-4 flex items-center font-manrope"><Dot className="w-8 h-8" />Other Modules</h3>
      <div className="flex flex-wrap gap-2">
        {otherModules.map((module) => (
          <span
            key={module}
            className="bg-[#EAF1FB] text-brand-blue border border-brand-blue/20 text-[11px] font-medium px-3 py-1.5 rounded-lg hover:scale-105 transition"
          >
            {module}
          </span>
        ))}
      </div>
    </div>
  )
}
