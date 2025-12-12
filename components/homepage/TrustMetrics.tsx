import { Users, Briefcase, Star, Globe, TrendingUp } from 'lucide-react';

const metrics = [
  {
    icon: Users,
    label: 'Active Consultants',
    value: '1,248',
    change: '+87 this month',
    trend: 'up',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Briefcase,
    label: 'Projects in Progress',
    value: '64',
    subtitle: 'across 11 countries',
    trend: 'neutral',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: Star,
    label: 'Avg Consultant Rating',
    value: '4.8/5',
    subtitle: '2,341 reviews',
    trend: 'up',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Globe,
    label: 'Platform Coverage',
    value: '50+',
    subtitle: 'countries · 12 SAP modules',
    trend: 'neutral',
    color: 'from-green-500 to-green-600'
  }
];

export function TrustMetrics() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16 border-b border-gray-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Live Platform Statistics</span>
          </div>
          <h2 className="text-gray-900 mb-2">Trusted by Global Enterprises</h2>
          <p className="text-gray-600">Real-time metrics from our growing network</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Gradient Accent */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${metric.color} rounded-t-2xl`} />
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {metric.change && (
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{metric.change}</span>
                    </div>
                  )}
                </div>
                <div className="text-4xl text-gray-900 mb-2">{metric.value}</div>
                <div className="text-sm text-gray-700 mb-1">{metric.label}</div>
                {metric.subtitle && (
                  <div className="text-xs text-gray-500 mt-2">{metric.subtitle}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}