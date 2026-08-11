import { X, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CustomInput } from '../homepage/ui/CustomInput';
import { PasswordInput } from '../homepage/ui/PasswordInput';
import { CustomButton } from '../homepage/ui/CustomButton';
// import { toast } from 'sonner';
import { ISignupDTO } from '@/types/common-auth';
import { useToast } from '@/providers/ToastProvider';
import { startLinkedInAuth } from '@/utils/startLinkedInAuth';

interface SignUpModalProps {
  onClose: () => void;
  onSignUp: (payload: ISignupDTO) => void;
  defaultUserType?: 'client' | 'consultant';
}

export function SignUpModal({ onClose, onSignUp }: SignUpModalProps) {
  const { toast } = useToast();

  // const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    if (password !== confirmPassword) {
      toast('Passwords do not match','error');
      return;
    }
    
    const payload = {
      // username,
      email,
      password,
    }

    onSignUp(payload);
  };

  const handleLinkedInSignUp = () => {
    startLinkedInAuth();
  };

  return (
    <div 
      className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm w-full relative my-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close signup modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </button>

        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6 md:mb-6">
            <Image
              src="/images/logo-footer.png"
              alt="Vertex9 Systems"
              width={80}
              height={40}
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-4 sm:mb-5 md:mb-6">
            <h3 id="signup-modal-title" className="mb-1 sm:mb-2 text-base sm:text-lg md:text-xl font-semibold text-gray-900">Create Your Account</h3>
            <p className="text-xs sm:text-sm text-gray-600">Join the Consultcrew</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* <CustomInput
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Alex"
              icon={<Mail className="w-5 h-5" />}
              required
            /> */}

            <CustomInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              showStrength
              helperText="Must be at least 8 characters with mixed case and numbers"
              required
            />

            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
              required
            />

            <CustomButton
              type="submit"
              size="md"
              variant="primary"
              fullWidth
              disabled={!email || !password || !confirmPassword || password !== confirmPassword}
            >
              Continue
            </CustomButton>
          </form>

          {/* Divider */}
          <div className="relative my-4 sm:my-5 md:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* LinkedIn SSO */}
          <button 
            onClick={handleLinkedInSignUp}
            type="button"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="#0A66C2" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="font-medium">Continue with LinkedIn</span>
          </button>

          <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-4 sm:mt-5 md:mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
