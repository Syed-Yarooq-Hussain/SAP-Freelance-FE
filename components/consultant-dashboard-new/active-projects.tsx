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

const TEMP_ACTIVE_PROJECTS: { name: string; client: string; status: string }[] = [
  { name: 'Digital Transformation', client: 'TechCorp Industries', status: 'Active' },
  { name: 'Supply Chain Audit', client: 'Meridian Logistics', status: 'Active' },
  { name: 'Brand Strategy', client: 'Novara Group', status: 'Pending' },
  { name: 'SAP S/4HANA Rollout', client: 'Global Retail Co.', status: 'Active' },
];

const colors = ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500'];
export const ActiveProjects: React.FC<{ data: DashboardData }> = ({ data }) => {
  // const projects = TEMP_ACTIVE_PROJECTS
  const projects = data?.projects?.projects?.length > 0 ? data?.projects?.projects?.slice(0, 4) : [];
  return (
    <div className="rounded-xl">
      <h3 className="text-sm font-manrope text-[#6B6B6B]">Active Projects</h3>
      <div className="space-y-3">
        {projects?.map((project, idx) => (
          <div key={idx} className="grid grid-cols-3 mt-3 items-center gap-3 pb-3 border-b border-[#F5F3EF] last:border-0">
            <div className="flex items-center gap-2">
            <div className={`w-2 h-2  rounded-full bg-[#292C63]`} />
              <p className="text-sm font-medium text-gray-900">{project?.name}</p>
            </div>
              <p className="text-xs text-gray-500 text-center">{project.client}</p>
            <p className="text-xs ml-auto w-fit text-center font-medium text-[#2D5A27] bg-[#E8F5E9] px-2 py-1 rounded-lg">
              {project.status}
            </p>
          </div>
        ))}
        {
          projects?.length == 0 && (
            TEMP_ACTIVE_PROJECTS.map((project, idx) => (
              <div key={idx} className=" mt-4 flex items-center gap-3 pb-3 border-b border-[#F5F3EF] last:border-0">
                <div className={`w-2 h-2 rounded-full bg-[#292C63]`} />
              </div>
            ))
          )
        }
      </div>

      {projects?.length > 4 && <button className="text-start flex items-center gap-2 w-full mt-4 text-xs text-gray-500 hover:text-gray-700">
        <User className="w-4 h-4" /> +{projects?.length - 4} more completed projects
      </button>}
      {
        projects?.length == 0 && (
          <button className="text-start flex items-center gap-2 w-full mt-4 text-xs text-gray-500 hover:text-gray-700">
            <User className="w-4 h-4" /> .................................
          </button>
        )
      }
    </div>
  );
};
