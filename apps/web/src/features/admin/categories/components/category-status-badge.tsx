import { Badge } from '#/components/ui/badge';

interface CategoryStatusBadgeProps {
  status: boolean;
  className?: string;
}

export const CategoryStatusBadge = ({ status, className }: CategoryStatusBadgeProps) => {
  const isActive = status;
  
  return (
    <Badge 
      className={`${
        isActive 
          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
      } ${className || ''}`}
    >
      {isActive ? 'Aktif' : 'Pasif'}
    </Badge>
  );
};
