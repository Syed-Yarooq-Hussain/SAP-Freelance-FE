import { Briefcase } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface BannerProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

const Banner = ({ onSignUpClick }: BannerProps) => {
  return (
    <section
      style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 50%, #EFF6FF 100%)' }}
      className="overflow-hidden"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 pt-10 sm:pt-16 md:pt-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight text-balance">
            Land Your Next Project
            <br />
            <span className="text-brand-blue">Faster Than Ever</span>
          </h1>

          <p className="mt-5 sm:mt-6 text-sm sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl text-pretty">
            Create your profile, set your availability, and let the right opportunities come to you
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onSignUpClick}
              className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm md:text-lg md:px-6 md:py-3.5 btn-gradient-blue text-white font-semibold rounded-full shadow-lg shadow-brand-blue/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
            >
              <Briefcase className="w-5 h-5" />
              <span>Join as a Consultant</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-4 sm:-mt-10 md:-mt-10 lg:-mt-24 w-full">
        <Image
          src="/images/homepage/banner_new.svg"
          alt="Dashboard and Team Management Interface showcasing project highlights, expert consultants, interview scheduling, and payment tracking"
          width={1200}
          height={700}
          className="w-full h-auto object-contain"
          priority
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] pointer-events-none hidden md:block">
          <Image
            src="/images/homepage/shade-blue.png"
            alt=""
            width={800}
            height={200}
            className="w-full h-auto object-contain opacity-40"
            quality={90}
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}

export default Banner
