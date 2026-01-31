import React from 'react';

/**
 * GradientCircle Component
 * 
 * A reusable gradient circle component with blur effect
 * 
 * @param {number} size - The size (width/height) of the circle in pixels (default: 400)
 * @param {number} opacity - The opacity of the gradient (0-1) (default: 0.48)
 * @param {string} color - The hex color of the gradient (default: '#1EAAC8')
 * @param {number} blur - The blur intensity in pixels (default: 64)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 */
const GradientCircle = ({ 
  size = 400, 
  opacity = 0.48, 
  color = '#1EAAC8',
  blur = 64,
  className = '',
  style = {}
}) => {
  // Generate unique ID for the filter to avoid conflicts when using multiple instances
  const filterId = `gradient-circle-filter-${Math.random().toString(36).substr(2, 9)}`;
  
  // Calculate viewBox and dimensions based on blur
  const padding = blur * 2;
  const viewBoxSize = size + padding * 2;
  const circleRadius = size / 2;
  const circleCenter = viewBoxSize / 2;

  return (
    <svg
      width={viewBoxSize}
      height={viewBoxSize}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width={viewBoxSize}
          height={viewBoxSize}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={blur} result="effect1_foregroundBlur" />
        </filter>
      </defs>
      <g opacity={opacity} filter={`url(#${filterId})`}>
        <circle
          cx={circleCenter}
          cy={circleCenter}
          r={circleRadius}
          fill={color}
        />
      </g>
    </svg>
  );
};

export default GradientCircle;