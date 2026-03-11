import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  showStrength?: boolean;
}

const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  if (!password) return { strength: 0, label: '', color: '' };
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
  if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
  if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
  return { strength, label: 'Strong', color: 'bg-green-500' };
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ 
    label = 'Password', 
    error, 
    helperText,
    showStrength = false,
    className = '',
    id,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || 'password';
    const hasError = !!error;
    
    const passwordStrength = showStrength && typeof value === 'string' 
      ? getPasswordStrength(value) 
      : null;

    return (
      <div className="w-full max-w-[500px]">
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Lock className="w-5 h-5" />
          </div>
          
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            className={`
              w-full pl-10 pr-12 py-2 
              border-2 rounded-lg
              transition-all duration-200
              ${hasError 
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500'
              }
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              placeholder:text-gray-400
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : 
              helperText ? `${inputId}-helper` : 
              passwordStrength ? `${inputId}-strength` :
              undefined
            }
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {showStrength && passwordStrength && passwordStrength.strength > 0 && (
          <div id={`${inputId}-strength`} className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 min-w-[50px]">
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}

        {error && (
          <p 
            id={`${inputId}-error`}
            className="mt-2 text-xs text-red-600 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p 
            id={`${inputId}-helper`}
            className="mt-2 text-xs text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
