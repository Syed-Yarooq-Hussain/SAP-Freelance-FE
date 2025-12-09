import { Star, Award, TrendingUp, ArrowRight, Sparkles, Briefcase, Code, CheckCircle2, Zap } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';


// Generate top 9 consultants data
const topConsultants = [
  { id: 1, code: 'C-10001', module: 'FICO', experienceYears: 15, rating: 5.0, completedProjects: 45, avatar: 'https://images.unsplash.com/photo-1589114207353-1fc98a11070b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMGNvbnN1bHRhbnR8ZW58MXx8fHwxNzY0OTk0NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', modules: ['Financial Accounting', 'Controlling', 'Asset Accounting'] },
  { id: 2, code: 'C-10023', module: 'ABAP', experienceYears: 12, rating: 4.9, completedProjects: 38, avatar: 'https://images.unsplash.com/photo-1758206523711-f20bb01033a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZXhwZXJ0JTIwd29ya2luZ3xlbnwxfHx8fDE3NjUwMzA0ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', modules: ['Custom Development', 'OData Services', 'Fiori Apps'] },
  { id: 3, code: 'C-10087', module: 'SD', experienceYears: 13, rating: 4.9, completedProjects: 42, avatar: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjUwMjgwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', modules: ['Sales Order Management', 'Pricing', 'Billing'] },
  { id: 4, code: 'C-10112', module: 'MM', experienceYears: 11, rating: 4.8, completedProjects: 35, avatar: 'https://images.unsplash.com/photo-1607799632518-da91dd151b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMGNvZGluZ3xlbnwxfHx8fDE3NjUwMzA0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', modules: ['Procurement', 'Inventory Management', 'Vendor Management'] },
  { id: 5, code: 'C-10045', module: 'HANA', experienceYears: 10, rating: 4.8, completedProjects: 30, avatar: 'https://images.unsplash.com/photo-1723987251277-18fc0a1effd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5c3QlMjB3b3JraW5nfGVufDF8fHx8MTc2NTAzMDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', modules: ['Database Administration', 'Performance Tuning', 'Migration'] },
  { id: 6, code: 'C-10156', module: 'HCM', experienceYears: 14, rating: 4.8, completedProjects: 40, avatar: 'https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnByaXNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjQ5NTgxNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', modules: ['Payroll', 'Time Management', 'Talent Management'] },
  { id: 7, code: 'C-10078', module: 'PP', experienceYears: 12, rating: 4.7, completedProjects: 33, avatar: 'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY1MDMwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', modules: ['Production Planning', 'Shop Floor Control', 'Capacity Planning'] },
  { id: 8, code: 'C-10091', module: 'BW', experienceYears: 11, rating: 4.7, completedProjects: 31, avatar: 'https://images.unsplash.com/photo-1758691463620-188ca7c1a04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uc3VsdGFudCUyMG1lZXRpbmd8ZW58MXx8fHwxNzY1MDMwNDg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', modules: ['Data Warehousing', 'Reporting', 'ETL Processes'] },
  { id: 9, code: 'C-10134', module: 'Basis', experienceYears: 13, rating: 4.7, completedProjects: 36, avatar: 'https://images.unsplash.com/photo-1758876203326-016526a303a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHlzdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjUwMzA0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', modules: ['System Administration', 'Security', 'System Landscape'] },
];

interface TopConsultantsProps {
  onBrowseConsultants: () => void;
  onSignupClick: () => void;
}

export function TopConsultants({ onBrowseConsultants, onSignupClick }: TopConsultantsProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Geometric patterns */}
      <div className="absolute top-40 right-20 w-32 h-32 border-4 border-blue-400/20 rounded-lg rotate-12 animate-pulse" />
      <div className="absolute bottom-40 left-20 w-24 h-24 border-4 border-indigo-400/20 rounded-full animate-pulse delay-500" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full border border-blue-600/20 mb-6">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600">Elite Talent Pool</span>
          </div>
          <h2 className="text-gray-900 mb-4">
            Top 9 SAP Consultants
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Meet our highest-rated SAP experts, ready to accelerate your projects with proven expertise and exceptional delivery.
          </p>
        </div>

        {/* Consultants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topConsultants.map((consultant, index) => (
            <div
              key={consultant.id}
              className="group relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-transparent hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.6) 50%, rgba(238,242,255,0.6) 100%)`
              }}
            >
              {/* Animated gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
              
              {/* Decorative shapes */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              {/* Rank Badge - Top Left Corner */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-br-3xl rounded-tl-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl text-white">{index + 1}</span>
              </div>

              {/* Top performer crown for #1 */}
              {index === 0 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg animate-bounce">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Card Content */}
              <div className="relative pt-10 space-y-4">
                {/* Avatar with decorative ring */}
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                    <ImageWithFallback
                      src={consultant.avatar}
                      alt={`Avatar of ${consultant.code}`}
                      className="relative w-20 h-20 rounded-full border-4 border-white shadow-xl ring-2 ring-blue-300/50 group-hover:ring-blue-500/70 transition-all transform group-hover:scale-110"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-1.5 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Consultant Code */}
                <div className="text-center">
                  <h3 className="text-gray-900 mb-1">{consultant.code}</h3>
                  <div className="flex items-center justify-center gap-1.5 text-gray-600">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-sm">{consultant.experienceYears}+ Years Experience</span>
                  </div>
                </div>

                {/* Module Badge with icon */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all transform group-hover:scale-105">
                    <Code className="w-4 h-4" />
                    <span className="text-sm">SAP {consultant.module}</span>
                  </div>
                </div>

                {/* Services List with checkmarks */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-blue-100/50 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>Key Services</span>
                  </div>
                  {consultant.modules.map((mod, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
                      </div>
                      <span className="text-xs text-gray-700 leading-relaxed">{mod}</span>
                    </div>
                  ))}
                </div>

                {/* Stats Row with vibrant colors */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-md">
                      <Star className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                    <div>
                      <span className="text-lg text-gray-900">{consultant.rating}</span>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-gray-300" />
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                      <TrendingUp className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <span className="text-lg text-gray-900">{consultant.completedProjects}</span>
                      <p className="text-xs text-gray-500">Projects</p>
                    </div>
                  </div>
                </div>

                {/* Hover CTA Button */}
                <button
                  onClick={onBrowseConsultants}
                  className="w-full opacity-0 group-hover:opacity-100 transition-all duration-300 px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBrowseConsultants}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              Browse All Consultants
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button
            onClick={onSignupClick}
            className="group relative px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Join the Team
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}