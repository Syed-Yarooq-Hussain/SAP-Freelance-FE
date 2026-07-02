"use client"

import { Users, Building2, Star, Globe } from "lucide-react"
import CornerPlusSigns from "./CornerPlusSigns"

const stats = [
  {
    icon: Users,
    value: "1,248",
    label: "Active Consultants",
    subLabel: null,
    growth: "+87 this month",
    variant: "blue" as const,
    gradient: "linear-gradient(180deg, #2E9BC6 1%, #164B60 101%)"
  },
  // {
  //   icon: Building2,
  //   value: "64",
  //   label: "Projects in Progress",
  //   subLabel: "across 11 countries",
  //   growth: "+87 this month",
  //   variant: "blue" as const,
  //   gradient: "linear-gradient(180deg, #51C0E9 0%, #096B93 100%)"
  // },
  // {
  //   icon: Star,
  //   value: "4.8/5",
  //   label: "Avg Consultant Rating",
  //   subLabel: "2,341 reviews",
  //   growth: "+87 this month",
  //   variant: "blue" as const,
  //   gradient: "linear-gradient(180deg, #70D9FF 0%, #268CB2 100%)"
  // },
  {
    icon: Globe,
    value: "50+",
    label: "Platform Coverage",
    subLabel: "countries · 12 modules",
    growth: "+87 this month",
    variant: "green" as const,
  },
]

export default function Reviews() {
  return (
    <section 
      id="why-choose"
      style={{background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #EFF6FF 100%)"}}
      className="relative border-b py-16 md:py-24 bg-gradient-to-b from-cyan-50/50 to-white overflow-hidden scroll-mt-24">
      {/* Small decorative plus signs */}
      <CornerPlusSigns size="lg" opacity={30} />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            Trusted by Global Enterprises
          </h2>
          <p className="text-muted-foreground text-2xl mt-10">
            Real-time metrics from our growing network
          </p>
        </div>

        {/* Stats Cards */}
        <div className="w-full md:w-[60%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              {/* Gradient header bar */}
              <div
                className="flex items-center justify-between rounded-xl p-3 mb-4"
                style={
                  stat.variant === "green"
                    ? { background: "linear-gradient(to bottom, #00C950, #00A63E)" }
                    : { background: stat.gradient}
                }
              >
                <stat.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                <span className="text-xs font-medium text-brand-green bg-white px-3 py-1 rounded-full">
                  {stat.growth}
                </span>
              </div>

              {/* Stat value */}
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>

              {/* Sub label */}
              {stat.subLabel && (
                <div className="text-gray-400 text-sm mt-0.5">
                  {stat.subLabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
