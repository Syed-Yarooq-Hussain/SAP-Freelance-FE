"use client"

import * as React from "react"
import { Trophy, Star, Briefcase, Clock, CheckCircle, Search, Zap, TrendingUp, MapPin } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/homepage/ui/carousel"
import { cn } from "@/components/homepage/ui/utils"

const consultants = [
  {
    rank: 2,
    rating: 4.9,
    module: "SAP ABAP",
    yearsExp: 12,
    projects: 38,
    successRate: 98,
    country: "Germany",
    flag: "🇩🇪",
  },
  {
    rank: 3,
    rating: 4.9,
    module: "SAP SD",
    yearsExp: 13,
    projects: 42,
    successRate: 98,
    country: "UK",
    flag: "🇬🇧",
  },
  {
    rank: 4,
    rating: 4.8,
    module: "SAP MM",
    yearsExp: 11,
    projects: 35,
    successRate: 98,
    country: "Canada",
    flag: "🇨🇦",
  },
  {
    rank: 5,
    rating: 4.8,
    module: "SAP HANA",
    yearsExp: 10,
    projects: 30,
    successRate: 98,
    country: "India",
    flag: "🇮🇳",
  },
  {
    rank: 6,
    rating: 4.8,
    module: "SAP HCM",
    yearsExp: 14,
    projects: 40,
    successRate: 98,
    country: "Australia",
    flag: "🇦🇺",
  },
  {
    rank: 7,
    rating: 4.7,
    module: "SAP FICO",
    yearsExp: 9,
    projects: 28,
    successRate: 97,
    country: "USA",
    flag: "🇺🇸",
  },
  {
    rank: 8,
    rating: 4.7,
    module: "SAP BW",
    yearsExp: 11,
    projects: 33,
    successRate: 97,
    country: "Netherlands",
    flag: "🇳🇱",
  },
]

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < fullStars
              ? "fill-amber-400 text-amber-400"
              : i === fullStars && hasHalfStar
                ? "fill-white text-amber-400"
                : "fill-slate-200 text-slate-200"
          )}
        />
      ))}
    </div>
  )
}

function ConsultantCard({ consultant }: { consultant: (typeof consultants)[0] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 p-5 h-full flex flex-col">
      {/* Header - Rank & Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs rounded-full p-1 text-white btn-gradient-blue">#{consultant.rank}</span>
          <StarRating rating={consultant.rating} />
        </div>
        <span className="text-sm font-semibold text-foreground">{consultant.rating}</span>
      </div>

      {/* Module Badge */}
      <div className="flex justify-center mb-4 mt-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white text-xs font-medium rounded-full">
          <span className="text-xs">{"<>"}</span>
          {consultant.module}
        </span>
      </div>

      {/* Years Experience */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-5">
        <Zap className="w-4 h-4 text-brand-blue" />
        <span>{consultant.yearsExp} Years Exp</span>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mb-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Projects</p>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-xs">{consultant.projects}</span>
          </div>
        </div>
        <div className="text-center flex items-center gap-1">
            <span className="btn-gradient-blue text-white rounded-full p-1">
              <TrendingUp className="w-3 h-3" />
            </span>
          <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-muted-foreground">Rating</p>
            <span className="font-semibold text-xs">{consultant.successRate}%</span>
          </div>
        </div>
      </div>

      {/* Country */}
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-auto">
        <span><MapPin className="w-3 h-3"/></span>
        <span>{consultant.country}</span>
      </div>
    </div>
  )
}

export default function Consultants({ onSignUpClick }: { onSignUpClick: () => void }) {
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
    <section id="elite-talent" className="py-16 md:py-24 bg-hero-gradient scroll-mt-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground text-balance">
            Meet our highest-rated SAP experts, ready to accelerate your projects with proven expertise and exceptional delivery.
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "start",
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {consultants.map((consultant, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <ConsultantCard consultant={consultant} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
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

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <button onClick={onSignUpClick} className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 btn-gradient-blue text-white font-semibold rounded-lg shadow-lg shadow-brand-blue/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-brand-blue/30 hover:scale-105 active:scale-95">
            <Briefcase className="w-5 h-5" />
            Join as a Consultant
          </button>
          {/* <button className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-foreground font-semibold rounded-lg border border-slate-200 shadow-sm transition-all duration-300 ease-out hover:border-brand-blue hover:text-brand-blue hover:scale-105 active:scale-95">
            <Search className="w-5 h-5" />
            Hire SAP Consultants
          </button> */}
        </div>
      </div>
    </section>
  )
}
