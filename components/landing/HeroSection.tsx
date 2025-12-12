import { APP_ROUTES } from '@/utils/app_routes';
import { Search, Briefcase, Sparkles, TrendingUp, Shield, Zap, Users, Clock, Award, CheckCircle, BarChart3, Globe } from 'lucide-react';

interface HeroSectionProps {
  onFindConsultants: () => void;
}

export function HeroSection({ onFindConsultants}: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Floating Stats Cards - Left Side */}
      <div className="hidden lg:block absolute left-8 top-32 animate-pulse" style={{ animationDuration: '3s' }}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl transform hover:scale-110 transition-transform">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <div className="text-2xl text-white">500+</div>
              <div className="text-xs text-blue-200">Expert Consultants</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute left-16 bottom-32 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl transform hover:scale-110 transition-transform">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Award className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="text-2xl text-white">4.9/5</div>
              <div className="text-xs text-blue-200">Client Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stats Cards - Right Side */}
      <div className="hidden lg:block absolute right-8 top-40 animate-pulse" style={{ animationDuration: '3.2s', animationDelay: '1s' }}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl transform hover:scale-110 transition-transform">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="text-2xl text-white">48hrs</div>
              <div className="text-xs text-blue-200">Avg. Match Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute right-12 bottom-40 animate-pulse" style={{ animationDuration: '3.8s', animationDelay: '1.5s' }}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl transform hover:scale-110 transition-transform">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="text-2xl text-white">95%</div>
              <div className="text-xs text-blue-200">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Icons */}
      <div className="hidden lg:block absolute left-1/4 top-20 opacity-30">
        <div className="animate-pulse" style={{ animationDuration: '2s' }}>
          <Globe className="w-12 h-12 text-white" />
        </div>
      </div>

      <div className="hidden lg:block absolute right-1/4 top-24 opacity-30">
        <div className="animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl text-white px-5 py-2.5 rounded-full mb-8 border border-white/20 shadow-2xl">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="text-sm">Premium SAP Marketplace · Pre-Vetted Talent Network</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>

          {/* Main Headline with Gradient */}
          <h1 className="mb-6 text-white leading-tight">
            Build SAP Teams in{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Days, Not Months
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300/30 blur-sm" />
            </span>
          </h1>
          
          {/* Enhanced Subtext */}
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Access elite pre-vetted SAP consultants, monitor real-time utilization, and scale your team instantly — all through one powerful platform.
          </p>

          {/* Enhanced CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={onFindConsultants}
              className="group relative flex items-center justify-center gap-2 bg-white text-blue-600 px-10 py-5 rounded-xl hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 transform overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              <Search className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Find Consultants</span>
              <Zap className="w-4 h-4 text-yellow-500 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => {
                window.location.href = (APP_ROUTES.SIGNUP_SELECT);
              }}
              className="group flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/30 backdrop-blur-sm px-10 py-5 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all shadow-lg"
            >
              <Briefcase className="w-5 h-5" />
              <span>Post a Project</span>
              <TrendingUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-xl border border-white/20 shadow-lg">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-300" />
              </div>
              <span className="text-white text-sm">All consultants pre-vetted</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-xl border border-white/20 shadow-lg">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white text-sm">50+ countries covered</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-xl border border-white/20 shadow-lg">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-white text-sm">Secure payments guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}