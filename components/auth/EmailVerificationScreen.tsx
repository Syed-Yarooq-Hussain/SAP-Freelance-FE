import { X, Mail, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CustomButton } from '../homepage/ui/CustomButton';
import { IUser } from '@/types/common-auth';
import { useSendVerificationEmail } from '@/actions/auth/useSendVerificationEmail';

interface EmailVerificationScreenProps {
  onClose: () => void;
  email: string;
  userDetails?: IUser | null
  onVerificationComplete?: () => void;
}

export function EmailVerificationScreen({ onClose, email, userDetails }: EmailVerificationScreenProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const { mutateAsync: mutateSendVerificationEmail, isPending: isSendVerificationEmailPending } = useSendVerificationEmail()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleSendVerificationEmail = async () => {
    if(!userDetails?.id) {
      toast.error('User details not found');
      return;
    }

    try {
      const response = await mutateSendVerificationEmail({ userId: userDetails.id });
      if(response?.status == 'success'){
        handleSendEmail()
      }else{
        toast.error(response?.message || 'Something went wrong');
      }
      return response;
    } catch (error: any) {
      console.error('Send verification email error:', error);
      throw error;
    }
  };

  const handleSendEmail = () => {
    // Simulate sending verification email
    toast.success('An Email has been sent to your email address.');
    setEmailSent(true);
    setCanResend(false);
    setCountdown(900); // 15 minutes = 900 seconds
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close verification modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/vx9-logo-02.png" alt="Vertex9 Systems" className="h-12" />
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              {emailSent ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <Mail className="w-10 h-10 text-blue-600" />
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h3 id="verification-modal-title" className="mb-2 text-gray-900">
              {emailSent ? 'Email Sent!' : 'Verify Your Email'}
            </h3>
            <p className="text-sm text-gray-600">
              {emailSent 
                ? `We've sent a verification link to ${email}`
                : 'Click below to verify your email address'
              }
            </p>
          </div>

          {!emailSent ? (
            <>
              {/* Email Display */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Sending verification email to:</p>
                <p className="font-medium text-gray-900">{email}</p>
              </div>

              {/* Send Email Button */}
              <CustomButton
                onClick={handleSendVerificationEmail}
                size="md"
                variant="primary"
                fullWidth
              >
                Send Email
              </CustomButton>
            </>
          ) : (
            <>
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900 mb-2">Next Steps:</p>
                <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the verification link in the email</li>
                  <li>You will be redirected to the login page</li>
                  <li>Sign in with your credentials</li>
                </ol>
              </div>

              {/* Resend Timer */}
              <div className="text-center mb-6">
                {!canResend && countdown > 0 ? (
                  <p className="text-sm text-gray-600">
                    You can resend the email in{' '}
                    <span className="font-medium text-blue-600">{formatTime(countdown)}</span>
                  </p>
                ) : (
                  <button
                    onClick={handleSendVerificationEmail}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    Resend verification email
                  </button>
                )}
              </div>

              {/* Expiry Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> The verification link expires in 15 minutes. If you do not verify within this time, you will need to sign up again.
                </p>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
          </div>

          {/* Wrong email? */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Wrong email address?{' '}
              <button
                onClick={onClose}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Go back
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}