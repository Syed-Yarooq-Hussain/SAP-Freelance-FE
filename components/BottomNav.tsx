'use client';

import { Roles } from '@/constants/roles';
import { APP_ROUTES } from '@/utils/app_routes';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  Calendar,
  FileText,
  CreditCard,
  Clock,
  Menu,
  X,
} from 'lucide-react';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  link: string;
};

const BottomNav: FC = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [moreOpen, setMoreOpen] = useState(false);
  const role = session?.user?.role;

  const items: NavItem[] = useMemo(() => {
    if (!role) return [];

    if (role === Roles.ADMIN) {
      const r = APP_ROUTES.ADMIN;
      return [
        { icon: <LayoutDashboard size={14} />, label: 'Dashboard', link: r.DASHBOARD },
        { icon: <User size={14} />, label: 'Profile', link: r.PROFILE },
        { icon: <Users size={14} />, label: 'Consultants', link: r.CONSULTANTS },
        { icon: <Briefcase size={14} />, label: 'Projects', link: r.PROJECTS },
        { icon: <CreditCard size={14} />, label: 'Payments', link: r.PAYMENTS },
        { icon: <CreditCard size={14} />, label: 'Consultant Pay', link: r.CONSULTANT_PAYMENTS },
      ];
    }

    if (role === Roles.CLIENT) {
      const r = APP_ROUTES.CLIENT;
      return [
        { icon: <LayoutDashboard size={14} />, label: 'Dashboard', link: r.DASHBOARD },
        { icon: <User size={14} />, label: 'Profile', link: r.PROFILE },
        { icon: <Users size={14} />, label: 'Consultant', link: r.CONSULTANT },
        { icon: <Briefcase size={14} />, label: 'Projects', link: r.PROJECTS },
        { icon: <CreditCard size={14} />, label: 'Payments', link: r.PAYMENTS },
      ];
    }

    // CONSULTANT role
    const r = APP_ROUTES.CONSULTANT;
    return [
      { icon: <LayoutDashboard size={14} />, label: 'Dashboard', link: r.DASHBOARD },
      { icon: <User size={14} />, label: 'My Profile', link: r.PROFILE },
      { icon: <Calendar size={14} />, label: 'My Calendar', link: r.CALENDAR },
      { icon: <FileText size={14} />, label: 'Documents', link: r.DOCUMENTS },
      { icon: <Clock size={14} />, label: 'Hour Logs', link: r.HOUR_LOGS },
      { icon: <CreditCard size={14} />, label: 'Payments', link: r.PAYMENTS },
    ];
  }, [role]);

  const primaryItems = items.slice(0, 3);
  const overflowItems = items.slice(3);
  const isMoreActive = overflowItems.some(
    (item) => pathname === item.link || pathname.startsWith(`${item.link}/`),
  );

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  if (status === 'loading' || items.length === 0) {
    return null;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40">
        <div className="rounded-t-2xl bg-[#F0F1F3] border border-t border-slate-300 px-2 py-2 shadow-lg">
          <div className="flex items-stretch justify-around">
            {primaryItems.map((item, index) => {
              const isActive =
                pathname === item.link || pathname.startsWith(`${item.link}/`);

              return (
                <div key={item.link} className="flex flex-1 items-stretch">
                  <Link
                    href={item.link}
                    className={`flex flex-col items-center justify-center gap-1.5 py-2 flex-1 relative groups`}
                  >
                    <div
                      className={`transition-colors ${
                        isActive ? 'text-brand-blue font-black' : 'font-medium text-brand-blue/90 group-hover:text-brand-blue'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`text-xs leading-none  text-center ${
                        isActive ? 'text-brand-blue font-black' : 'font-medium text-brand-blue/90 group-hover:text-brand-blue'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                  {index < 3 ? (
                    <div className="my-3 w-px bg-white/40" />
                  ) : null}
                </div>
              );
            })}

            <div className="flex flex-1 items-stretch">
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                className="flex flex-col items-center justify-center gap-1.5 py-2 flex-1"
              >
                <Menu
                  size={14}
                  className={`transition-colors ${isMoreActive ? 'text-brand-blue' : 'text-brand-blue/90'}`}
                />
                <span
                  className={`text-xs leading-none font-medium text-center ${
                    isMoreActive ? 'text-brand-blue' : 'text-brand-blue/90'
                  }`}
                >
                  More
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {moreOpen ? (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/40 flex items-end"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="w-full rounded-t-2xl bg-white px-4 pb-6 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">More options</h3>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {overflowItems.map((item) => {
                const isActive =
                  pathname === item.link || pathname.startsWith(`${item.link}/`);
                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium ${
                      isActive
                        ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className={isActive ? 'text-brand-blue' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BottomNav;
