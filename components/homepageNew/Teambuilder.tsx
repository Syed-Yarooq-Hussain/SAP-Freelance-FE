"use client"

import { Users, FileText, CheckCircle, Zap, ArrowRight } from "lucide-react"
import CornerPlusSigns from "./CornerPlusSigns"

const steps = [
  {
    number: 1,
    icon: Users,
    title: "Sign Up in Seconds",
    description: "Create your account or continue with Google — no lengthy forms to start",
  },
  {
    number: 2,
    icon: FileText,
    title: "Build Your Profile",
    description: "Add your experience, expertise, and availability so clients know exactly when and how you can help",
  },
  {
    number: 3,
    icon: CheckCircle,
    title: "Earn Badges, Get Noticed",
    description: "Unlock verification badges that boost your credibility and push your profile higher in client searches",
  },
]

export default function Teambuilder() {
  return (
    <section id="team-builder" className="relative py-16 md:py-24 overflow-hidden scroll-mt-24">
      {/* Background with bottom gradient */}
      <div 
        className="absolute inset-0" 
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F9FA 50%, #E0F4F8 100%)' }}
      />
      
      {/* Small decorative plus signs */}
      <CornerPlusSigns size="lg" opacity={30} />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
           Join as a Consultant in 3 simple steps
          </h2>
          
          <p className="text-muted-foreground text-xl mt-2 max-w-2xl mx-auto">
            From shortlisting to onboarding — everything happens in one platform
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection line with arrows - hidden on mobile, behind icons */}
          <div className="hidden md:block absolute top-14 left-[15%] right-[15%] z-0">
            <div className="relative w-full h-0.5 bg-gradient-light-blue">
              {/* First arrow */}
              <div className="absolute left-[28%] top-1/2 -translate-y-[50%]">
                <ArrowRight className="w-5 h-5 text-brand-blue-dark" />
              </div>
              {/* Second arrow */}
              <div className="absolute left-[68%] top-1/2 -translate-y-[50%]">
                <ArrowRight className="w-5 h-5 text-brand-blue-dark" />
              </div>
            </div>
          </div>

          {/* Three step columns */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-6">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center flex-1 max-w-xs">
                {/* Circle with icon */}
                <div className="relative z-10 mb-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full btn-gradient-blue flex items-center justify-center shadow-[0_25px_80px_rgba(59,168,208,0.6),0_10px_30px_rgba(59,168,208,0.4)]">
                    <step.icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
                  </div>
                  {/* Number badge */}
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center text-brand-blue font-bold text-sm shadow-sm">
                    {step.number}
                  </div>
                </div>

                {/* Card below icon */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-brand-blue/10 border border-slate-100 text-center w-full">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-brand-blue text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
