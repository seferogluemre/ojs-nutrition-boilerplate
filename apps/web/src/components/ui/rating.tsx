import { cn } from "#lib/utils.js";
import { Star } from "lucide-react";
import * as React from "react";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  onValueChange?: (value: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5", 
  lg: "h-6 w-6",
};

export function Rating({
  value,
  max = 5,
  size = "md",
  readonly = false,
  onValueChange,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const handleStarClick = (starValue: number) => {
    if (readonly) return;
    onValueChange?.(starValue);
  };

  const handleStarHover = (starValue: number) => {
    if (readonly) return;
    setHoverValue(starValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(null);
  };

  return (
    <div 
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isActive = (hoverValue ?? value) >= starValue;
        
        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            className={cn(
              "transition-colors duration-200",
              !readonly && "hover:scale-105 cursor-pointer",
              readonly && "cursor-default"
            )}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-200",
                isActive 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "fill-transparent text-gray-300 hover:text-yellow-400"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

// Display-only rating component
export function RatingDisplay({ 
  value, 
  max = 5, 
  size = "md", 
  className 
}: Omit<RatingProps, "readonly" | "onValueChange">) {
  return (
    <Rating 
      value={value} 
      max={max} 
      size={size} 
      readonly 
      className={className} 
    />
  );
}