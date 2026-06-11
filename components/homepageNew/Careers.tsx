"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  type CarouselApi,
} from "@/components/homepage/ui/carousel"
import { cn } from "../homepage/ui/utils"


const slides = [
  {
    tag: "Why Consultants Love the Consultcrew",
    title: "Global Reach & Opportunities",
    benefits: [
      {
        number: 1,
        title: "Global Exposure",
        description: "Work with top-tier clients across 50+ countries",
      },
      {
        number: 2,
        title: "Endless Opportunities",
        description: "Access 1,000+ live projects worldwide",
      },
      {
        number: 3,
        title: "Diverse Projects",
        description: "Work across modules, industries, and business sizes",
      },
    ],
  },
  {
    tag: "Why Consultants Love the Consultcrew",
    title: "Flexible Work & Fair Pay",
    benefits: [
      {
        number: 1,
        title: "Work on Your Terms",
        description: "Choose projects that match your schedule and expertise",
      },
      {
        number: 2,
        title: "Competitive Rates",
        description: "Get paid fairly with transparent pricing models",
      },
      {
        number: 3,
        title: "Secure Payments",
        description: "Receive timely payments through our secure platform",
      },
    ],
  },
  {
    tag: "Why Consultants Love the Consultcrew",
    title: "Career Growth & Support",
    benefits: [
      {
        number: 1,
        title: "Skill Development",
        description: "Access training resources and certifications",
      },
      {
        number: 2,
        title: "Community Network",
        description: "Connect with 1,200+ professionals worldwide",
      },
      {
        number: 3,
        title: "Dedicated Support",
        description: "Get help from our consultant success team",
      },
    ],
  },
]

interface CareersProps {
  onSignUpClick?: () => void;
}

export default function Careers({ onSignUpClick }: CareersProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section 
      id="join-consultant"
      className="py-8 md:py-12 bg-hero-gradient relative scroll-mt-24">
      <div className="absolute top-0 left-[-10%] w-1/2 h-full z-0">
        <Image
          src="/images/homepage/shade-blue.png"
          alt="Careers Background"
          fill
          className="object-cover object-left"
        />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-foreground text-balance">
            Why Consultants Love the Consultcrew
          </h2>
        </div> */}
        {/* Header */}
        {/* <div className="flex flex-col items-center text-center mb-12 relative z-10">
          <button className="inline-flex items-center gap-2 px-4 py-2 btn-gradient-blue text-white text-sm font-medium rounded-full mb-4 transition-all duration-300 hover:scale-105 active:scale-95">
            <Sparkles className="w-4 h-4" />
            Join Our Network
          </button>
          <p className="text-brand-blue font-medium my-3">Join as an SAP Consultant</p>
          <h2 className="text-xl mt-4 md:text-3xl lg:text-4xl font-bold text-foreground w-full text-balance">
            Build your independent SAP career, on your terms. Work with global clients, choose your projects, and get paid securely.
          </h2>
        </div> */}

        {/* Carousel */}
        <div className="max-w-5xl mt-10 md:mt-20 mx-auto ">
          <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-[0_25px_50px_-12px_rgba(59,168,208,0.3)] border border-brand-blue overflow-hidden relative z-10">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Left Content */}
                      <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                        {/* <span className=" text-center inline-block px-3 py-1.5 btn-gradient-blue text-white text-xs font-medium rounded-full border border-cyan-100 mb-4 w-fit">
                          {slide.tag}
                        </span> */}
                        <h3 className="text-xl md:text-start text-center md:text-2xl font-semibold text-foreground mb-6">
                          {slide.title}
                        </h3>
                        <div className="space-y-4">
                          {slide.benefits.map((benefit) => (
                            <div key={benefit.number} className="flex gap-4">
                              <div className="flex-shrink-0 w-7 h-7 rounded-md btn-gradient-blue text-white flex items-center justify-center text-sm font-semibold">
                                {benefit.number}
                              </div>
                              <div>
                                <h5 className="font-semibold text-foreground">
                                  {benefit.title}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  {benefit.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Image */}
                      <div className="relative p-10 h-64 md:h-auto bg-gradient-to-br from-slate-900 to-slate-800">
                        <div className="relative w-full h-full shadow-xl shadow-brand-blue rounded-3xl overflow-hidden">
                          <Image
                            src="/images/homepage/career.png"
                            alt="Global network visualization"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrow - Right side */}
            <CarouselNext className="hidden md:flex right-0 translate-x-1/2 bg-white border-slate-200 hover:bg-slate-50 hover:border-brand-blue shadow-lg" />
          </Carousel>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8 z-10 relative">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  current === index
                    ? "bg-brand-blue w-6"
                    : "bg-slate-300 hover:bg-slate-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center mt-12 relative z-10">
          <button 
            onClick={onSignUpClick}
            className="group inline-flex text-sm md:text-lg items-center justify-center gap-1 md:gap-2 px-8 py-4 btn-gradient-blue text-white font-semibold rounded-full shadow-lg shadow-brand-blue/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            Register as a Consultant
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-center text-xs md:text-sm text-muted-foreground flex items-center gap-1">
            <span className=" text-xs md:text-base">💪 Join 1,200+ experts already on the platform</span>
            
          </p>
        </div>
      </div>
    </section>
  )
}
