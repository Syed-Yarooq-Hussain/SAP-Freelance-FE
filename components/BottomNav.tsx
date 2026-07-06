'use client';

import { useLogout } from '@/actions/auth/logout';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { Roles } from '@/constants/roles';
import { logoutUser } from '@/lib/store/features/user/userSlice';
import { useAppDispatch } from '@/lib/store/hook';
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
  Settings,
  Lock,
  LogOut,
  ChevronRight,
} from 'lucide-react';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  link: string;
};

type MoreMenuItem = {
  icon: React.ReactNode;
  label: string;
  link?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
};

type MoreMenuSection = {
  title: string;
  items: MoreMenuItem[];
};

const BottomNav: FC = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { mutate: logout } = useLogout();
  const [moreOpen, setMoreOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
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

  const moreSections: MoreMenuSection[] = useMemo(() => {
    if (!role) return [];

    if (role === Roles.CONSULTANT) {
      const r = APP_ROUTES.CONSULTANT;
      return [
        {
          title: 'Documents & Payment',
          items: [
            { icon: <FileText size={18} />, label: 'Documents', link: r.DOCUMENTS },
            { icon: <CreditCard size={18} />, label: 'Payments', link: r.PAYMENTS },
          ],
        },
        {
          title: 'Personal Settings',
          items: [
            { icon: <Settings size={18} />, label: 'Account Settings', link: r.ACCOUNT },
            { icon: <Lock size={18} />, label: 'Change Password', link: r.CHANGE_PASSWORD },
            {
              icon: <LogOut size={18} />,
              label: 'Logout',
              onClick: () => setSignOutOpen(true),
              variant: 'danger',
            },
          ],
        },
      ];
    }

    const overflowItems = items.slice(3);
    if (overflowItems.length === 0) return [];

    return [
      {
        title: 'More',
        items: overflowItems.map((item) => ({
          icon: item.icon,
          label: item.label,
          link: item.link,
        })),
      },
      {
        title: 'Personal Settings',
        items: [
          {
            icon: <LogOut size={18} />,
            label: 'Logout',
            onClick: () => setSignOutOpen(true),
            variant: 'danger',
          },
        ],
      },
    ];
  }, [items, role]);

  const moreActivePaths = useMemo(() => {
    if (role === Roles.CONSULTANT) {
      const r = APP_ROUTES.CONSULTANT;
      return [r.DOCUMENTS, r.PAYMENTS, r.ACCOUNT, r.CHANGE_PASSWORD];
    }
    return items.slice(3).map((item) => item.link);
  }, [items, role]);

  const primaryItems = items.slice(0, 3);
  const isMoreActive = moreActivePaths.some(
    (link) => pathname === link || pathname.startsWith(`${link}/`),
  );

  const handleLogout = () => {
    logout();
    dispatch(logoutUser());
  };

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [moreOpen]);

  const renderMoreItem = (item: MoreMenuItem) => {
    const isActive = item.link
      ? pathname === item.link || pathname.startsWith(`${item.link}/`)
      : false;

    const content = (
      <>
        <span
          className={
            item.variant === 'danger'
              ? 'text-red-500'
              : isActive
                ? 'text-brand-blue'
                : 'text-slate-500'
          }
        >
          {item.icon}
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        {item.link ? (
          <ChevronRight
            size={16}
            className={isActive ? 'text-brand-blue' : 'text-slate-400'}
          />
        ) : null}
      </>
    );

    const className = `flex w-full items-center justify-start gap-3 px-1 py-3.5 text-left text-sm font-medium transition-colors border-b border-slate-300/70 last:border-b-0 ${
      item.variant === 'danger'
        ? 'text-red-600'
        : isActive
          ? 'text-brand-blue'
          : 'text-slate-800'
    }`;

    if (item.link) {
      return (
        <Link key={item.link} href={item.link} className={className}>
          {content}
        </Link>
      );
    }

    return (
      <button
        key={item.label}
        type="button"
        onClick={item.onClick}
        className={className}
      >
        {content}
      </button>
    );
  };

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
                    className="flex flex-col items-center justify-center gap-1.5 py-2 flex-1 relative groups"
                  >
                    <div
                      className={`transition-colors ${
                        isActive
                          ? 'text-brand-blue font-black'
                          : 'font-medium text-brand-blue/90 group-hover:text-brand-blue'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`text-xs leading-none text-center ${
                        isActive
                          ? 'text-brand-blue font-black'
                          : 'font-medium text-brand-blue/90 group-hover:text-brand-blue'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                  {index < 3 ? <div className="my-3 w-px bg-white/40" /> : null}
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
        <div className="fixed inset-0 z-[1300] md:hidden flex flex-col bg-[#F0F1F3]">
          <button
            type="button"
            onClick={() => setMoreOpen(false)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center text-slate-700"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={2} />
          </button>

          <div className="flex items-center border-b border-slate-200 bg-[#F0F1F3] px-5 py-4 pr-16">
            <h1 className="text-lg font-semibold text-slate-900">More</h1>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 pb-28">
            {moreSections.map((section) => (
              <div key={section.title} className="mb-8 last:mb-0">
                <h2 className="mb-2 text-sm font-semibold text-slate-900">
                  {section.title}
                </h2>
                <div>
                  {section.items.map((item) => renderMoreItem(item))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <ConfirmDeleteModal
        isOpen={signOutOpen}
        title="Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onCancel={() => setSignOutOpen(false)}
        onConfirm={() => {
          setSignOutOpen(false);
          setMoreOpen(false);
          handleLogout();
        }}
      />
    </>
  );
};

export default BottomNav;
