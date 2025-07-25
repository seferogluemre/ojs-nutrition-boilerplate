import { CartSidebar } from "#components/layout/cart-sidebar";
import { MobileSidebar } from "#components/layout/mobile-sidebar";
import { Button } from "#components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";
import { Input } from "#components/ui/input";
import { api } from "#lib/api.js";
import { cn } from "#lib/utils";
import { useAuthStore } from "#stores/authStore.js";
import { useCartStore } from "#stores/cartStore.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, ShoppingCart, User } from "lucide-react";
import React, { useState } from "react";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Header = ({
  className,
  fixed,
  ...props
}: HeaderProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const { auth } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const queryClient = useQueryClient();


  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await api.auth["sign-out"].post();
    },
    onSuccess: () => {
      // Reset auth and cart
      auth.reset();
      clearCart();
      queryClient.clear();
      router.navigate({ to: "/login" });
    },
    onError: (error) => {
      console.error("Logout request failed:", error);
      // Even if logout fails, clear local state
      auth.reset();
      clearCart();
      queryClient.clear();
      router.navigate({ to: "/login" });
    },
  });

  const cartItemCount = items.length;

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const toggleCartSidebar = () => {
    setIsCartSidebarOpen(!isCartSidebarOpen);
  };

  const closeCartSidebar = () => {
    setIsCartSidebarOpen(false);
  };

  return (
    <header
      className={cn(
        "flex h-20 items-center justify-between bg-white border-b border-gray-200 relative",
        // Responsive padding - tutarlı ortalama için + vertical padding eklendi
        "px-4 py-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20",
        fixed && "header-fixed peer/header fixed z-50 w-full shadow-md",
        className,
      )}
      {...props}
    >
      {/* Desktop Layout (lg+) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo - Sol */}
        <div className="flex-shrink-0">
          <div className="flex items-center">
           <img src="/images/image.png" alt="logo" className="h-10" />
          </div>
        </div>

        {/* Search Bar - Orta, esnek genişlik */}
        <div className="flex-1 max-w-lg mx-8">
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
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Hesabım Button - Border'lı ve dropdown oklı */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 border-gray-300 hover:bg-gray-50 px-4 py-2 h-10"
              >
                <User className="w-5 h-5 text-gray-600" />
                <div className="flex flex-col items-start">
                  {auth.user ? (
                    <>
                      <span className="text-xs text-gray-500">{auth.user.firstName} {auth.user.lastName}</span>
                      
                    </>
                  ) : (
                    <span className="text-gray-700 font-medium">HESAP</span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 z-[9999]" sideOffset={5}>
              {auth.user ? (
                <>
                  <DropdownMenuItem className="text-center border-b border-gray-300">
                    <a href="/account" className="w-full">
                      Hesabım
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-center"
                    onClick={() => {
                      logoutMutation.mutate();
                    }}
                  >
                    <span className="w-full cursor-pointer">
                      Çıkış Yap
                    </span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="text-center border-b border-gray-300">
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
          
          {/* Sepet Button - Gri background'lu */}
          <Button 
            size="sm" 
            className="flex items-center space-x-2 relative bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 h-10"
            onClick={toggleCartSidebar}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">SEPET</span>
            {/* Cart Badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {cartItemCount}
            </span>
          </Button>
        </div>
      </div>

      {/* Tablet Layout (md-lg) */}
      <div className="hidden md:flex lg:hidden items-center justify-between w-full max-w-5xl mx-auto">
        {/* Logo - Sol */}
        <div className="flex-shrink-0">
          <div className="flex items-center">
           <img src="/images/image.png" alt="logo" className="h-8" />
          </div>
        </div>

        {/* Search Bar - Orta */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Aradığınız ürünü yazınız..."
              className="w-full pl-9 pr-16 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 h-6 text-xs"
            >
              ARA
            </Button>
          </div>
        </div>

        {/* Account & Cart - Sağ */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Hesabım Button - Tablet için kompakt */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1 border-gray-300 hover:bg-gray-50 px-3 py-2 h-9"
              >
                <User className="w-4 h-4 text-gray-600" />
                <div className="flex flex-col items-start">
                  {auth.user ? (
                    <>
                      <span className="text-xs text-gray-500 text-xs">{auth.user.firstName} {auth.user.lastName}</span>
                    </>
                  ) : (
                    <span className="text-gray-700 font-medium text-sm">HESAP</span>
                  )}
                </div>
                <ChevronDown className="w-3 h-3 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 z-[9999]" sideOffset={5}>
              {auth.user ? (
                <>
                  <DropdownMenuItem className="text-center border-b border-gray-300">
                    <a href="/account" className="w-full text-sm">
                      Hesabım
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-center"
                    onClick={() => {
                      logoutMutation.mutate();
                    }}
                  >
                    <span className="w-full cursor-pointer text-sm">
                      Çıkış Yap
                    </span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="text-center border-b border-gray-300">
                    <a href="/sign-in" className="w-full text-sm">
                      Üye girişi
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-center">
                    <a href="/sign-up" className="w-full text-sm">
                      Üye ol
                    </a>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sepet Button - Tablet için kompakt */}
          <Button 
            size="sm" 
            className="flex items-center space-x-1 relative bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 h-9"
            onClick={toggleCartSidebar}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium text-sm">SEPET</span>
            {/* Cart Badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartItemCount}
            </span>
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex items-center justify-between w-full">
        <Button variant="ghost" size="sm" onClick={toggleMobileSidebar}>
          <Menu className="w-7 h-7 stroke-2" />
        </Button>
        
        <div className="flex-1 text-center">
          <span className="text-lg font-black">OJS NUTRITION</span>
        </div>
        
        <Button variant="ghost" size="sm" className="relative" onClick={toggleCartSidebar}>
          <ShoppingCart className="w-7 h-7 stroke-2" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-black">
            {cartItemCount}
          </span>
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartSidebarOpen} onClose={closeCartSidebar} />
    </header>
  );
};

Header.displayName = "Header";
