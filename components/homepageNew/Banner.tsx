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
      className="flex flex-col h-[80vh] md:h-[88vh] min-h-[80vh] overflow-hidden"
    >
      <div className="container relative z-10 mx-auto flex-shrink-0 px-4 sm:px-6 pt-8 sm:pt-10 md:pt-12 lg:pt-14">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight text-balance">
            Land Your Next Project
            <br />
            <span className="text-brand-blue">Faster Than Ever</span>
          </h1>

          <p className="mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl text-pretty">
            Create your profile, set your availability, and let the right opportunities come to you
          </p>

          <div className="mt-5 sm:mt-6 md:mt-7 flex justify-center">
            <button
              onClick={onSignUpClick}
              className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm md:text-base md:px-6 md:py-3.5 btn-gradient-blue text-white font-semibold rounded-full shadow-lg shadow-brand-blue/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
            >
              <Briefcase className="w-5 h-5" />
              <span>Join as a Consultant</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-0 flex-1 min-h-0 w-full -mt-2 sm:-mt-6 md:-mt-8 lg:-mt-12">
        <Image
          src="/images/homepage/banner_new.svg"
          alt="Dashboard and Team Management Interface showcasing project highlights, expert consultants, interview scheduling, and payment tracking"
          fill
          sizes="100vw"
          className="object-contain object-bottom"
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
