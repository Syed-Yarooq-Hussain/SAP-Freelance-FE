import { Briefcase, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface BannerProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

const Banner = ({ onLoginClick, onSignUpClick }: BannerProps) => {
    return (
        <section 
        style={{background: "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 50%, #EFF6FF 100%)"        }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 overflow-hidden">
          <div className="container h-full mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left Content */}
              <div className="flex-1 max-w-2xl mb:0 md:mb:32 xl:mb-44 text-center lg:text-left">
                <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-normal tracking-tight text-balance">
                  Build Your SAP{" "}
                  <br className="hidden sm:block" />
                  Dream Team —{" "}
                  <br className="hidden sm:block" />
                  <span className="text-brand-blue">Faster Than Ever</span>
                </h1>
                
                <p className="mt-6 text-lg sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty">
                  Discover verified SAP experts, schedule calls instantly, and build high-performing SAP teams worldwide.
                </p>
                
                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button 
                      onClick={onSignUpClick}
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 btn-gradient-blue text-white font-semibold rounded-full shadow-lg shadow-brand-blue/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
                    >
                        <Briefcase className="w-5 h-5" />
                        <span>Join as a Consultant</span>
                    </button>
                  
                  {/* <button 
                    onClick={onLoginClick}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-700 font-semibold rounded-full border-2 border-slate-200 shadow-sm transition-all duration-300 ease-out hover:border-brand-blue hover:text-brand-blue hover:shadow-md hover:scale-105 active:scale-95"
                  >
                    <Search className="w-5 h-5" />
                    <span>Hire SAP Consultants</span>
                  </button> */}
                </div>
              </div>
              
              {/* Right Image */}
              <div className="flex-1 w-full lg:max-w-none">
                <div className="relative">
                  <Image
                    src="/images/homepage/banner.png"
                    alt="SAP Dashboard and Team Management Interface showcasing project highlights, expert consultants, interview scheduling, and payment tracking"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain z-10 relative scale-110"
                    priority
                  />
                <div className='absolute bottom-[-25%] left-[2%]'>
                  <Image
                    src="/images/homepage/shade-blue.png"
                    alt="Shade Blue"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain opacity-50"
                    quality={90}
                    priority
                  />
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
}

export default Banner