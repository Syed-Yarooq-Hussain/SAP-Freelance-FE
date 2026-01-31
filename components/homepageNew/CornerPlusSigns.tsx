import * as React from "react"

interface CornerPlusSignsProps {
  className?: string
  color?: "brand-blue" | "white" | "foreground"
  size?: "sm" | "md" | "lg" | "xl"
  opacity?: 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl",
}

const colorClasses = {
  "brand-blue": "text-brand-blue",
  white: "text-white",
  foreground: "text-foreground",
}

export default function CornerPlusSigns({
  className = "",
  color = "brand-blue",
  size = "lg",
  opacity = 100,
}: CornerPlusSignsProps) {
  const colorClass = colorClasses[color]
  const opacityValue = opacity / 100
  const baseClasses = `${colorClass} ${sizeClasses[size]} ${className}`

  return (
    <div
      className="absolute top-8 left-8 grid grid-cols-2 gap-2"
      style={{ opacity: opacityValue }}
    >
      <div className={baseClasses}>+</div>
      <div className={baseClasses}>+</div>
      <div className={baseClasses}>+</div>
      <div className={baseClasses}>+</div>
    </div>
  )
}

