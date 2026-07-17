import { X, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { PasswordInput } from '../homepage/ui/PasswordInput';
import { CustomButton } from '../homepage/ui/CustomButton';

interface ResetPasswordScreenProps {
  onClose: () => void;
  onPasswordReset: () => void;
}

export function ResetPasswordScreen({ onClose, onPasswordReset }: ResetPasswordScreenProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Simulate password reset
    toast.success('Password reset successfully!');
    setIsSuccess(true);
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      onPasswordReset();
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-password-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close reset password modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo-footer.png"
              alt="Vertex9 Systems"
              width={140}
              height={40}
              className="h-12 w-auto"
            />
          </div>

          {!isSuccess ? (
            <>
              {/* Title */}
              <div className="text-center mb-6">
                <h3 id="reset-password-modal-title" className="mb-2 text-gray-900">Create New Password</h3>
                <p className="text-sm text-gray-600">
                  Choose a strong password for your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordInput
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  showStrength
                  helperText="Must be at least 8 characters with mixed case and numbers"
                  required
                />

                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  error={confirmPassword && newPassword !== confirmPassword ? "Passwords don't match" : undefined}
                  required
                />

                <div className="pt-2">
                  <CustomButton
                    type="submit"
                    size="md"
                    variant="primary"
                    fullWidth
                    disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                  >
                    Reset Password
                  </CustomButton>
                </div>
              </form>

              {/* Password Requirements */}
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    At least 8 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Contains uppercase and lowercase letters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Contains at least one number
                  </li>
                </ul>
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
                <h3 className="mb-2 text-gray-900">Password Reset Complete!</h3>
                <p className="text-sm text-gray-600">
                  Your password has been successfully reset.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Redirecting you to login...
                </p>
              </div>

              {/* Loading indicator */}
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
