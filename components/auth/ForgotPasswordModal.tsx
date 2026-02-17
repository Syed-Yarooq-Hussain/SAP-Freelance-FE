import { X, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { CustomInput } from '../homepage/ui/CustomInput';
import { CustomButton } from '../homepage/ui/CustomButton';
import { useForgetPassword } from '@/actions/auth/useForgetPassword';


interface ForgotPasswordModalProps {
  onClose: () => void;
  onBackToLogin: () => void;
  onResetLinkClick?: () => void;
}

export function ForgotPasswordModal({ onClose, onBackToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { mutateAsync: mutateForgetPassword, isPending: isForgetPasswordPending } = useForgetPassword()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await mutateForgetPassword({ email })
      console.log('Forgot password response:', response)
      if(response?.status == 'success'){
        toast.success(response?.message ||'Password reset email sent successfully!');
        setEmailSent(true);
      }else{
        toast.error(response?.message ||'Something went wrong!');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error)
      throw error
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close forgot password modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/vx9-logo-02.png"
              alt="Vertex9 Systems"
              width={140}
              height={40}
              className="h-12 w-auto"
            />
          </div>

          {!emailSent ? (
            <>
              {/* Title */}
              <div className="text-center mb-6">
                <h3 id="forgot-password-modal-title" className="mb-2 text-gray-900">Reset Your Password</h3>
                <p className="text-sm text-gray-600">
                  Enter your email address and we will send you a link to reset your password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <CustomInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  icon={<Mail className="w-5 h-5" />}
                  required
                />

                <CustomButton
                  type="submit"
                  size="md"
                  variant="primary"
                  fullWidth
                  disabled={!email}
                >
                  Continue
                </CustomButton>
              </form>

              {/* Back to Login */}
              <div className="mt-6">
                <button
                  onClick={onBackToLogin}
                  className="flex items-center justify-center gap-2 w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center mb-6">
                <h3 className="mb-2 text-gray-900">Check Your Email</h3>
                <p className="text-sm text-gray-600">
                  We have sent a password reset link to
                </p>
                <p className="font-medium text-gray-900 mt-2">{email}</p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900 mb-2">Next Steps:</p>
                <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the password reset link</li>
                  <li>Enter your new password</li>
                  <li>Login with your new credentials</li>
                </ol>
              </div>

              {/* Expiry Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> The reset link expires in 15 minutes. If you do not reset within this time, you will need to request a new link.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <CustomButton
                  onClick={onBackToLogin}
                  size="md"
                  variant="primary"
                  fullWidth
                >
                  Back to Login
                </CustomButton>
                
                
                
                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  Did not receive the email? Resend
                </button>
              </div>
            </>
          )}

          {!emailSent && (
            <p className="text-xs text-gray-500 text-center mt-6">
              Remember your password?{' '}
              <button
                onClick={onBackToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}