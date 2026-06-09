import { DollarSign, Award, Zap, Shield, Sparkles } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Cost & Efficiency',
    features: [
      'Reduce costs by up to 50%',
      'Zero overhead (HR, admin, benefits)',
      'No hiring delays – instant onboarding',
      'Flexible payment models'
    ],
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    icon: Award,
    title: 'Talent & Quality',
    features: [
      '1,000+ Experts',
      'Top-tier, pre-vetted consultants',
      'Verified solutions',
      'Niche module expertise'
    ],
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: Zap,
    title: 'Flexibility',
    features: [
      'Custom teams (junior → senior)',
      'Seamless replacement',
      'Always available',
      'Scale up or down instantly'
    ],
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    icon: Shield,
    title: 'Logistics',
    features: [
      'No travel needed',
      'Secure & reliable operations',
      'Future-proof workforce',
      '24/7 platform support'
    ],
    color: 'green',
    gradient: 'from-green-500 to-green-600'
  }
];

export function ClientBenefits() {
  return (
    <div className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Client Benefits</span>
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Why Choose the Consultcrew?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Everything you need to build, manage, and scale your teams efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10`} style={{ padding: '2px' }}>
                  <div className="absolute inset-0.5 bg-white rounded-2xl" />
                </div>

                {/* Icon with Animated Background */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <div className={`relative w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <h3 className="mb-5 text-gray-900">{benefit.title}</h3>
                <ul className="space-y-3">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
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
      </div>
    </div>
  );
}