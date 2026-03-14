import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText,
    icon,
    rightIcon,
    className = '',
    id,
    ...props 
  }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-2
              ${icon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
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
              undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p 
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p 
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'Input';
