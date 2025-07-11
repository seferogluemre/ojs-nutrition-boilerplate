import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { cn } from "#lib/utils";
import { ChevronDown, Menu, Search, ShoppingCart, User } from "lucide-react";
import React from "react";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Header = ({
  className,
  fixed,
  ...props
}: HeaderProps) => {
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between bg-white border-b border-gray-200",
        // Responsive padding: Mobile (px-4), Tablet (px-6), Desktop (px-12)
        "px-4 md:px-6 lg:px-12",
        fixed && "header-fixed peer/header fixed z-50 w-full shadow-md",
        className,
      )}
      {...props}
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Logo - Sol */}
        <div className="flex-shrink-0">
          <div className="flex items-center">
           <img src="/images/image.png" alt="logo" className=" h-10" />
          </div>
        </div>

        {/* Search Bar - Orta */}
        <div className="flex-1 max-w-2xl mx-6 lg:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Aradığınız ürünü yazınız..."
              className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 h-7 text-xs"
            >
              ARA
            </Button>
          </div>
        </div>

        {/* Account & Cart - Sağ */}
        <div className="flex items-center space-x-4">
          {/* Hesabım Button - Border'lı ve dropdown oklı */}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2 border-gray-300 hover:bg-gray-50 px-4 py-2 h-10"
          >
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">HESAP</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </Button>
          
          {/* Sepet Button - Gri background'lu */}
          <Button 
            size="sm" 
            className="flex items-center space-x-2 relative bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 h-10"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">SEPET</span>
            {/* Cart Badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              0
            </span>
          </Button>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="md:hidden flex items-center justify-between w-full">
        <Button variant="ghost" size="sm">
          <Menu className="w-6 h-6" />
        </Button>
        
        <div className="flex-1 text-center">
          <span className="text-lg font-bold">OJS NUTRITION</span>
        </div>
        
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            0
          </span>
        </Button>
      </div>
    </header>
  );
};

Header.displayName = "Header";
