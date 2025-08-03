import { Button } from "#components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";
import { ChevronDown, User } from "lucide-react";
import React from "react";

interface User {
  firstName?: string;
  lastName?: string;
}

interface AccountDropdownProps {
  user: User | null;
  onLogout: () => void;
  variant?: "desktop" | "tablet";
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  user,
  onLogout,
  variant = "desktop"
}) => {
  const getStyles = () => {
    switch (variant) {
      case "desktop":
        return {
          trigger: "flex h-9 items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-900 hover:bg-gray-100",
          userIcon: "h-4 w-4",
          userName: "text-sm font-medium",
          chevron: "h-3 w-3"
        };
      case "tablet":
        return {
          trigger: "flex h-9 items-center space-x-1 border-gray-300 px-3 py-2 hover:bg-gray-50",
          userIcon: "h-4 w-4 text-gray-600",
          userName: "text-sm font-medium text-gray-700",
          chevron: "h-3 w-3 text-gray-600"
        };
      default:
        return {
          trigger: "flex h-9 items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-900 hover:bg-gray-100",
          userIcon: "h-4 w-4",
          userName: "text-sm font-medium",
          chevron: "h-3 w-3"
        };
    }
  };

  const styles = getStyles();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "tablet" ? "outline" : "ghost"}
          size="sm"
          className={styles.trigger}
        >
          <User className={styles.userIcon} />
          {variant === "tablet" ? (
            <div className="flex flex-col items-start">
              {user ? (
                <span className="text-xs text-gray-500">
                  {user.firstName} {user.lastName}
                </span>
              ) : (
                <span className={styles.userName}>HESAP</span>
              )}
            </div>
          ) : (
            <span className={styles.userName}>
              {user?.firstName || "HESAP"}
            </span>
          )}
          <ChevronDown className={styles.chevron} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-[9999] w-40"
        sideOffset={5}
      >
        {user ? (
          <>
            <DropdownMenuItem className="border-b border-gray-300 text-center">
              <a href="/account" className="w-full">
                Hesabım
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-center"
              onClick={onLogout}
            >
              <span className="w-full cursor-pointer">Çıkış Yap</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem className="border-b border-gray-300 text-center">
              <a href="/login" className="w-full">
                Üye girişi
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-center">
              <a href="/login" className="w-full">
                Üye ol
              </a>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};