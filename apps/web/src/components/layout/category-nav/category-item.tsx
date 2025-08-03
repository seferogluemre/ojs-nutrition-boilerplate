import { ChevronDown } from "lucide-react";
import React from "react";

interface CategoryItemProps {
  category: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isHovered,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <li 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative z-50"
    >
      <a
        href="#"
        className={`transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap py-2 relative z-50 flex items-center space-x-1 ${
          isHovered 
            ? 'text-blue-700' 
            : 'text-white hover:text-gray-300'
        }`}
      >
        <span>{category}</span>
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-300 ${
            isHovered ? 'rotate-180 text-blue-700' : 'rotate-0'
          }`}
        />
      </a>
    </li>
  );
};