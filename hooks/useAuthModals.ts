import { useLogin } from '@/actions/auth/login';
import { useSignupConsultant } from '@/actions/auth/signupConsultant';
import { useForgetPassword } from '@/actions/auth/useForgetPassword';
import { useResetPassword } from '@/actions/auth/useResetPassword';
import { useSendVerificationEmail } from '@/actions/auth/useSendVerificationEmail';
import { useToast } from '@/providers/ToastProvider';
import { ISignupDTO, IUser } from '@/types/common-auth';
import { useState } from 'react';
import { toast } from 'sonner';
// import { toast } from 'sonner';

export interface AuthModalHandlers {
  openLogin: () => void;
  openSignUp: (userType?: 'client' | 'consultant') => void;
  openForgotPassword: () => void;
  closeAll: () => void;
}

export interface IBaseSignupDTO {
  username: string;
  email: string;
  password: string;
}

export interface AuthModalState {
  showLogin: boolean;
  showSignUp: boolean;
  showEmailVerification: boolean;
  showForgotPassword: boolean;
  showResetPassword: boolean;
  signUpEmail: string;
  signUpUserType: 'client' | 'consultant' | undefined;
}

export function useAuthModals() {
  const [userDetails, setUserDetails] = useState<IUser | null>(null)
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUserType, setSignUpUserType] = useState<'client' | 'consultant' | undefined>(undefined);

  //mutations - using mutateAsync to get responses
  const { mutateAsync: mutateLogin, isPending: isLoginPending } = useLogin()
  const { mutateAsync: mutateSignUp, isPending: isSignupPending } = useSignupConsultant()
  const { mutateAsync: mutateForgetPassword, isPending: isForgetPasswordPending } = useForgetPassword()
  const { mutateAsync: mutateResetPassword, isPending: isResetPasswordPending } = useResetPassword()


  const openLogin = () => {
    setShowLogin(true);
    setShowSignUp(false);
    setShowEmailVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
  };

  const openSignUp = (userType?: 'client' | 'consultant') => {
    setSignUpUserType(userType);
    setShowSignUp(true);
    setShowLogin(false);
    setShowEmailVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setShowLogin(false);
    setShowSignUp(false);
    setShowEmailVerification(false);
    setShowResetPassword(false);
  };

  const closeAll = () => {
    setShowLogin(false);
    setShowSignUp(false);
    setShowEmailVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setSignUpEmail('');
    setSignUpUserType(undefined);
  };

  const handleLogin = async (data: {email: string, password: string}) => {
    // Add your login logic here
    try {
      const response = await mutateLogin(data);
      return response;
    } catch (error: any) {
      // Extract backend error message
      const errorMessage = error?.message || error?.response?.data?.message || 'Login failed';
      
      console.log('Login error:', {
        error,
        message: errorMessage,
        fullError: error
      });
      
      // Show backend error message to user
      toast.error(errorMessage);      
    }
  };

  const handleSignUp = async (payload: ISignupDTO) => {
    try {
      const response:any = await mutateSignUp(payload);
      if(response?.data?.id){
        setUserDetails(response?.data)
        setSignUpEmail(payload.email);
        setShowSignUp(false);
        setShowEmailVerification(true);
      }

      if(response?.message){
        toast.success(response?.message);
      }else{
        toast.error(response?.data?.message || 'Something went wrong');
      }
      // const responseData = response?.data as any;
      // const userId = responseData?.id || responseData?.user?.id;
      // return { response, userId };
    } catch (error: any) {
      let errorMessage = error?.message || 'Something went wrong';
      if(error?.response?.data?.message){
        errorMessage = error?.response?.data?.message;
      }
      toast.error(errorMessage);
      console.error('Signup error:', error);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      const response = await mutateForgetPassword({ email });
      return response;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const handleResetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
    try {
      const response = await mutateResetPassword({ token, newPassword, confirmPassword });
      return response;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setShowLogin(true);
  };

  const handlePasswordReset = () => {
    setShowResetPassword(false);
    setShowLogin(true);
  };

  // const handleResetLinkClick = (email:string) => {
  //   setShowForgotPassword(false);
  //   setShowResetPassword(true);
  // };

  return {
    // State
    showLogin,
    showSignUp,
    showEmailVerification,
    showForgotPassword,
    showResetPassword,
    signUpEmail,
    signUpUserType,
    userDetails,
    // Loading states
    isSignupPending,
    isForgetPasswordPending,
    isResetPasswordPending,
    // Handlers
    openLogin,
    openSignUp,
    openForgotPassword,
    closeAll,
    handleLogin,
    handleSignUp,
    handleForgotPassword,
    handleResetPassword,
    handleBackToLogin,
    handlePasswordReset,
    // handleResetLinkClick,
  };
}

