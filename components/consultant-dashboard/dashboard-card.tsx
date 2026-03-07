'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../homepage/ui/card';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
}

export function DashboardCard({ icon, title, children, onClick, href }: DashboardCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className="p-6 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </Card>
  );
}
