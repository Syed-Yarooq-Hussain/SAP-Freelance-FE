import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-12 py-5 text-xl'
};

const variantClasses = {
  primary: 'bg-[#0891B2] text-white hover:bg-[#0E7490] shadow-lg hover:shadow-xl disabled:bg-gray-400',
  secondary: 'bg-[#E0F4F8] text-[#0891B2] border-2 border-[#0891B2] hover:bg-[#B8E6EF] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300',
  ghost: 'bg-transparent text-[#0891B2] hover:bg-[#E0F4F8] disabled:text-gray-400 disabled:hover:bg-transparent',
  outline: 'bg-transparent border-2 border-[#A5DBE8] text-[#164E63] hover:border-[#0891B2] hover:text-[#0891B2] disabled:border-gray-200 disabled:text-gray-400'
};

export const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    size = 'md', 
    variant = 'primary', 
    loading = false,
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          relative inline-flex items-center justify-center gap-2 
          rounded-xl font-semibold
          transition-all duration-300
          transform hover:scale-105 active:scale-95
          disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0891B2]
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';