'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { APP_ROUTES } from '@/utils/app_routes';
import Image from 'next/image';
import { Loader2, XCircle } from 'lucide-react';
import "@/utils/styles/index.css";
import { getConsultantMeService } from '@/services/getConsultantProfile';
import { updateUser } from '@/lib/store/features/user/userSlice';
import { useAppDispatch } from '@/lib/store/hook';

export default function LinkedInCallback() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleLinkedInAuth = async () => {
      if (!token) {
        setError('No authentication token provided');
        setIsLoading(false);
        return;
      }

      try {
        // Sign in with NextAuth using the token
        // The authorize function will fetch user data using getMe
        const result = await signIn('credentials', {
          redirect: false,
          token: token,
        });
        if (result?.error) {
          throw new Error(result.error);
        }

        // After successful sign in, get the session to determine user role
        const session = await getSession();
        
        const role = session?.user?.role;
        let dashboardRoute = APP_ROUTES.HOME;

        switch (role) {
          case 1:
            dashboardRoute = APP_ROUTES.CLIENT.DASHBOARD;
            break;
          case 2:
            dashboardRoute = APP_ROUTES.CONSULTANT.DASHBOARD;
            break;
          case 3:
            dashboardRoute = APP_ROUTES.ADMIN.DASHBOARD;
            break;
          default:
            dashboardRoute = APP_ROUTES.HOME;
        }

        if (role === 2) {
          try {
            const consultantData = await getConsultantMeService();
            if (consultantData?.data) {
              dispatch(
                updateUser({
                  user: { ...consultantData.data, loginWithLinkedin: true },
                })
              );
            }
          } catch (error) {
            console.error('Failed to fetch consultant profile:', error);
          }
        }
        // Redirect to appropriate dashboard
        router.push(dashboardRoute);
      } catch (err: any) {
        console.error('LinkedIn authentication error:', err);
        setError(err?.message || 'Failed to authenticate with LinkedIn');
        setIsLoading(false);
      }
    };

    handleLinkedInAuth();
  }, [token, router]);

  if (error) {
    return (
      <div className="tailwind min-h-screen bg-gradient-to-br from-white via-white to-cyan-50/70 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md relative bg-white rounded-3xl shadow-2xl border border-slate-100/50 p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <Image
              src="/vx9-logo-02.png"
              alt="Vertex9 Systems"
              width={140}
              height={40}
              className="h-12 w-auto"
            />
          </div>
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="p-3 bg-red-50 rounded-full">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Authentication Failed
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {error}
              </p>
            </div>
            <button
              onClick={() => router.push(APP_ROUTES.HOME)}
              className="btn-gradient-blue w-full text-white font-semibold py-3 rounded-full transition-all duration-300 ease-out hover:shadow-lg hover:shadow-brand-blue/30 hover:scale-105 active:scale-95"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tailwind min-h-screen bg-gradient-to-br from-white via-white to-cyan-50/70 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md relative bg-white rounded-3xl shadow-2xl border border-slate-100/50 p-8 md:p-10">
        <div className="flex justify-center mb-8">
          <Image
            src="/vx9-logo-02.png"
            alt="Vertex9 Systems"
            width={140}
            height={40}
            className="h-12 w-auto"
          />
        </div>
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Signing in with LinkedIn
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Please wait while we authenticate your account...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
