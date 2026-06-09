'use client';

import { DashboardData } from '@/types/dashboard';
import { Briefcase, User } from 'lucide-react';
import React from 'react';

export const ActiveProjects: React.FC<{ data: DashboardData }> = ({ data }) => {
  const projects = data?.projects?.projects?.length > 0 ? data?.projects?.projects?.slice(0, 4) : [];
  return (
    <div className="rounded-xl">
      <h3 className="text-sm font-manrope text-[#6B6B6B]">Active Projects</h3>
      <div className="space-y-3">
        {projects?.length > 0 ? (
          projects.map((project, idx) => (
            <div key={idx} className="grid grid-cols-3 mt-3 items-center gap-3 pb-3 border-b border-[#F5F3EF] last:border-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-[#292C63]`} />
                <p className="text-sm font-medium text-gray-900">{project?.name}</p>
              </div>
              <p className="text-xs text-gray-500 text-center">{project.client}</p>
              <p className="text-xs ml-auto w-fit text-center font-medium text-[#2D5A27] bg-[#E8F5E9] px-2 py-1 rounded-lg">
                {project.status}
              </p>
            </div>
          ))
        ) : (
          <div
            className="mt-4 rounded-xl border border-dashed border-[#E5E5E5] bg-[#FAFAFA] px-4 py-8 text-center"
            role="status"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#E8ECF4]">
              <Briefcase className="h-5 w-5 text-[#6B6B6B]" aria-hidden />
            </div>
            <p className="text-sm font-medium text-gray-900 font-manrope">No active projects</p>
            <p className="mt-1 max-w-[260px] mx-auto text-xs leading-relaxed text-[#6B6B6B] font-manrope">
              When you&apos;re working on a project, it will appear in this list.
            </p>
          </div>
        )}
      </div>

      {projects?.length > 4 && (
        <button className="text-start flex items-center gap-2 w-full mt-4 text-xs text-gray-500 hover:text-gray-700">
          <User className="w-4 h-4" /> +{projects?.length - 4} more completed projects
        </button>
      )}
    </div>
  );
};
