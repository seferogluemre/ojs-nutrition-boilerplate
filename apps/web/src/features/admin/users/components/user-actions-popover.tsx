import { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '#/components/ui/popover';
import { User } from '../types/types';

interface UserActionsPopoverProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserActionsPopover = ({ user, onView, onEdit, onDelete }: UserActionsPopoverProps) => {
  const [open, setOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Menüyü aç</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="end">
        <div className="grid gap-1">
          <Button
            variant="ghost"
            className="justify-start h-8 px-2"
            onClick={() => handleAction(() => onView(user))}
          >
            <Eye className="mr-2 h-4 w-4" />
            Detayları Görüntüle
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-8 px-2"
            onClick={() => handleAction(() => onEdit(user))}
          >
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleAction(() => onDelete(user))}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};