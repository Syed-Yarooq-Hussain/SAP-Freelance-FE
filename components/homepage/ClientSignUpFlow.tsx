import { APP_ROUTES } from '@/utils/app_routes';
import { FileText, Rocket, ArrowRight, Zap, Users, DollarSign } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Users,
    title: 'Shortlist Consultant',
    description: 'Select consultant, Schedule interview',
    details: 'Browse pre-vetted SAP consultants and schedule interviews with your top picks',
    color: 'from-blue-500 to-blue-600'
  },
  {
    number: 2,
    icon: FileText,
    title: 'Set Project',
    description: 'Product scopes, details, and all details',
    details: 'Define project scope, timeline, deliverables, and requirements',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    number: 3,
    icon: DollarSign,
    title: 'Finance',
    description: 'Set payments',
    details: 'Agree on rates, payment terms, and milestones with your consultant',
    color: 'from-purple-500 to-purple-600'
  }
];

export function ClientSignUpFlow() {
  return (
    <div className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Quick & Easy Process</span>
          </div>
          <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Client Sign-Up Workflow: 3 Simple Steps
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Post your first project and connect with pre-vetted SAP consultants today
          </p>
        </div>

        <div className="relative">
          {/* Enhanced Connection Line with Arrows */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 mx-40">
            <div className="relative h-1 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 rounded-full">
              <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 -translate-x-1/2">
                <ArrowRight className="w-6 h-6 text-blue-400" />
              </div>
              <div className="absolute top-1/2 left-2/3 transform -translate-y-1/2 -translate-x-1/2">
                <ArrowRight className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  <div className="flex flex-col items-center text-center">
                    {/* Enhanced Icon Circle */}
                    <div className="relative mb-8 group">
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse`} style={{ animationDuration: `${2 + index * 0.5}s` }} />
                      <div className={`relative w-24 h-24 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                        <Icon className="w-11 h-11 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-blue-600">{step.number}</span>
                      </div>
                    </div>

                    {/* Enhanced Content Card */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all transform hover:-translate-y-1 w-full">
                      <h3 className="mb-3 text-gray-900">{step.title}</h3>
                      <p className={`bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-3`}>
                        {step.description}
                      </p>
                      <p className="text-sm text-gray-600">{step.details}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={() => {
                window.location.href = (APP_ROUTES.SIGNUP_SELECT);
              }}
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Rocket className="w-5 h-5 relative z-10 group-hover:-rotate-12 transition-transform" />
            <span className="relative z-10">Start Hiring Now</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-600 mt-4 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No credit card required • Post your first project free
          </p>
        </div>
      </div>
    </div>
  );
}