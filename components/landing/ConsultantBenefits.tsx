import { TrendingUp, Compass, Award, Shield, Rocket } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Opportunity & Income',
    features: [
      'Global exposure (50+ countries)',
      'Endless opportunities (1,000+ live projects)',
      'Set your own rates',
      'Reliable payments',
      'Zero bench time'
    ],
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Compass,
    title: 'Control & Flexibility',
    features: [
      'Flexible work arrangements (FT, PT)',
      'Work from anywhere (100% remote)',
      'Zero admin or paperwork',
      'Instant onboarding'
    ],
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Award,
    title: 'Career Growth',
    features: [
      'Skill-based matching',
      'Build your professional brand',
      'Performance visibility (ratings & reviews)',
      'Professional development',
      'Diverse project opportunities'
    ],
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Shield,
    title: 'Future-Proof Career',
    features: [
      'Continuous learning opportunities',
      'Access to premium clients',
      'Long-term project stability',
      'Build lasting client relationships'
    ],
    gradient: 'from-green-500 to-emerald-500'
  }
];

interface ConsultantBenefitsProps {
  onRegister: () => void;
}

export function ConsultantBenefits({ onRegister }: ConsultantBenefitsProps) {
  return (
    <div className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-purple-700 px-4 py-2 rounded-full mb-6 border border-purple-200">
            <Rocket className="w-4 h-4 animate-pulse" />
            <span className="text-sm">For SAP Consultants</span>
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Why Consultants Love the SAP Freelance Portal
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Join a thriving community of SAP professionals and unlock unlimited opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-transparent transform hover:-translate-y-2"
              >
                {/* Animated Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity`} />
                  <div className={`relative w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <h3 className="mb-5 text-gray-900">{benefit.title}</h3>
                <ul className="space-y-3">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button 
            onClick={onRegister}
            className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Rocket className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">Join as SAP Consultant</span>
          </button>
          <p className="text-sm text-gray-600 mt-4 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free to join • Start earning in 48 hours
          </p>
        </div>
      </div>
    </div>
  );
}