'use client';

import { DashboardData } from '@/types/dashboard';
import { User } from 'lucide-react';
import React from 'react';

interface Project {
  name: string;
  company: string;
  status: 'Active' | 'Pending';
  color: string;
}

const projects: Project[] = [
  { name: 'Digital Transformation', company: 'TechCorp Industries', status: 'Active', color: 'bg-blue-500' },
  { name: 'Supply Chain Audit', company: 'Meridian Logistics', status: 'Active', color: 'bg-orange-500' },
  { name: 'Brand Strategy', company: 'Novara Group', status: 'Active', color: 'bg-orange-400' },
  { name: 'Brand Strategy', company: 'Novara Group', status: 'Active', color: 'bg-orange-400' },
];
const colors = ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500'];
export const ActiveProjects: React.FC<{ data: DashboardData }> = ({ data }) => {
  const projects = data?.projects?.projects?.length > 0 ? data?.projects?.projects?.slice(0, 4) : [];
  return (
    <div className="bg-white rounded-xl">
      <div className="space-y-3">
        {data?.projects?.projects?.map((project, idx) => (
          <div key={idx} className="flex items-center gap-3 pb-3 border-b border-[#F5F3EF] last:border-0">
            <div className={`w-3 h-3 rounded-full ${colors[idx]}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{project?.name}</p>
              <p className="text-xs text-gray-500">{project.client}</p>
            </div>
            <span className="text-xs font-medium text-[#2D5A27] bg-[#E8F5E9] px-2 py-1 rounded-lg">
              {project.status}
            </span>
          </div>
        ))}
      </div>

      {data?.projects?.projects?.length > 4 && <button className="text-start flex items-center gap-2 w-full mt-4 text-xs text-gray-500 hover:text-gray-700">
        <User className="w-4 h-4" /> +{data?.projects?.projects?.length - 4} more completed projects
      </button>}
    </div>
  );
};
