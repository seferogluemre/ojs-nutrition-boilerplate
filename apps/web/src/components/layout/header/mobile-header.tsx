import { ThemeSwitch } from "#components/theme-switch";
import { Button } from "#components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import React from "react";
import { CartButton } from "./cart-button";

interface MobileHeaderProps {
  cartItemCount: number;
  onMenuClick: () => void;
  onCartClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  cartItemCount,
  onMenuClick,
  onCartClick
}) => {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between md:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuClick} 
        className="text-gray-700 dark:text-gray-900 hover:bg-gray-100"
      >
        <Menu className="h-9 w-9 stroke-2" />
      </Button>

      <div className="flex flex-1 justify-center">
        <img
          src="/images/image.png"
          alt="logo"
          className="h-8 cursor-pointer"
          onClick={() => router.navigate({ to: "/" })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <ThemeSwitch />
        
        <CartButton
          variant="mobile"
          cartItemCount={cartItemCount}
          onClick={onCartClick}
        />
      </div>
    </div>
  );
};