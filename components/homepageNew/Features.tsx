"use client"

import * as React from "react"
import Image from "next/image"
import { DollarSign, Clock, TrendingUp, Zap } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  type CarouselApi,
} from "@/components/homepage/ui/carousel"
import CornerPlusSigns from "./CornerPlusSigns"
import GradientCircle from "@/components/common/GradientCircle"

const slides = [
  {
    badge: "Save money. Move fast.",
    benefits: [
      {
        icon: 'dollar.svg',
        number: 1,
        title: "Expert Matching",
        description: "AI-powered consultant recommendations.",
        iconColor: "teal",
      },
      {
        icon: 'spark.svg',
        number: 2,
        title: "Performance Tracking",
        description: "Real-time project monitoring dashboards.",
        iconColor: "teal",
      },
      {
        icon: 'clock.svg',
        number: 3,
        title: "Secure Payments",
        description: "Escrow-protected transactions.",
        iconColor: "green",
      },
      {
        icon: 'upIcon.png',
        number: 4,
        title: "Fast Onboarding",
        description: "Start projects within 48 hours.",
        iconColor: "green",
      },
    ],
  },
  {
    badge: "Work smarter. Scale faster.",
    benefits: [
      {
        icon: 'dollar.svg',
        number: 1,
        title: "Expert Matching",
        description: "AI-powered consultant recommendations.",
        iconColor: "teal",
      },
      {
        icon: 'spark.svg',
        number: 2,
        title: "Performance Tracking",
        description: "Real-time project monitoring dashboards.",
        iconColor: "teal",
      },
      {
        icon: 'clock.svg',
        number: 3,
        title: "Secure Payments",
        description: "Escrow-protected transactions.",
        iconColor: "green",
      },
      {
        icon: 'upIcon.png',
        number: 4,
        title: "Fast Onboarding",
        description: "Start projects within 48 hours.",
        iconColor: "green",
      },
    ],
  },
  {
    badge: "Quality guaranteed.",
    benefits: [
      {
        icon: 'dollar.svg',
        number: 1,
        title: "Expert Matching",
        description: "AI-powered consultant recommendations.",
        iconColor: "teal",
      },
      {
        icon: 'spark.svg',
        number: 2,
        title: "Performance Tracking",
        description: "Real-time project monitoring dashboards.",
        iconColor: "teal",
      },
      {
        icon: 'clock.svg',
        number: 3,
        title: "Secure Payments",
        description: "Escrow-protected transactions.",
        iconColor: "green",
      },
      {
        icon: 'upIcon.png',
        number: 4,
        title: "Fast Onboarding",
        description: "Start projects within 48 hours.",
        iconColor: "green",
      },
    ],
  },
  {
    badge: "Global reach. Local impact.",
    benefits: [
      {
        icon: 'dollar.svg',
        number: 1,
        title: "Expert Matching",
        description: "AI-powered consultant recommendations.",
        iconColor: "teal",
      },
      {
        icon: 'spark.svg',
        number: 2,
        title: "Performance Tracking",
        description: "Real-time project monitoring dashboards.",
        iconColor: "teal",
      },
      {
        icon: 'clock.svg',
        number: 3,
        title: "Secure Payments",
        description: "Escrow-protected transactions.",
        iconColor: "green",
      },
      {
        icon: 'upIcon.png',
        number: 4,
        title: "Fast Onboarding",
        description: "Start projects within 48 hours.",
        iconColor: "green",
      },
    ],
  },
]

export default function Features() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section 
      id="how-different"
      style={{background: "linear-gradient(180deg, #E0F4F8 0%, #FFFFFF 50%, #F0F9FA 100%)"}}
      className="relative py-16 md:py-24 overflow-hidden bg-hero-gradient scroll-mt-24">
      {/* Background decorative elements */}
      <div className="absolute top-[-40%] left-[-10%] z-0">
        <GradientCircle 
          size={600} 
          opacity={0.2} 
          color="#1EAAC8" 
          blur={64}
          className="md:w-[700px] md:h-[700px]"
        />
      </div>
      <div className="absolute top-[-60%] right-[10%] z-0">
        <GradientCircle 
          size={600} 
          opacity={0.3} 
          color="#1EAAC8" 
          blur={64}
          className="md:w-[700px] md:h-[700px]"
        />
      </div>
      <div className="absolute bottom-[-20%] right-0 z-0">
        <GradientCircle 
          size={500} 
          opacity={0.4} 
          color="#1EAAC8" 
          blur={64}
          className="md:w-[600px] md:h-[600px]"
        />
      </div>

      {/* Small decorative plus signs */}
      <CornerPlusSigns size="lg" opacity={30} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <h2 className="text-3xl bg-transparent md:text-5xl lg:text-6xl font-bold text-center text-foreground mb-12 md:mb-16">
          How We are Different
        </h2>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto shadow-xl"
        >
          <CarouselContent>
            {slides.map((slide, slideIndex) => (
              <CarouselItem key={slideIndex}>
                <div className="bg-white rounded-3xl border shadow-xl p-6 md:p-10 lg:p-12">
                  {/* Badge */}
                  <div className="flex justify-center mb-8">
                    <span className="btn-gradient-blue text-white px-6 py-2.5 rounded-full font-bold text-sm md:text-base">
                      {slide.badge}
                    </span>
                  </div>

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {slide.benefits.map((benefit, benefitIndex) => (
                      <div
                        key={benefitIndex}
                        className="flex items-start gap-4 p-4 md:p-5 rounded-2xl border border-pink-200  bg-white hover:shadow-md transition-shadow"
                      >
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${
                            benefit.iconColor === "teal"
                              ? "bg-gradient-to-br from-gradient-blue-start to-gradient-blue-end"
                              : "bg-gradient-to-br from-gradient-green-start to-gradient-green-end"
                          }`}
                        >
                          <Image src={`/images/homepage/${benefit.icon}`} alt={benefit.title} width={60} height={60} />
                        </div>

                        {/* Content */}
                        <div className="flex items-start gap-2 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`mt-1 inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold text-white ${
                              benefit.number === 3 ? 'bg-gradient-green' : 'bg-button-blue'
                            }`}>
                              {benefit.number}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground text-base md:text-lg">
                              {benefit.title}
                            </h3>
                            <p className="text-muted-foreground text-sm md:text-base">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrow */}
          <CarouselNext className="hidden md:flex absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border-0 hover:bg-slate-50 transition-all duration-300 hover:scale-105 active:scale-95" />
        </Carousel>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-6 bg-button-blue"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
