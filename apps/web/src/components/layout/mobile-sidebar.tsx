import { Button } from "#components/ui/button";
import { api } from "#lib/api.js";
import { cn } from "#lib/utils";
import { useAuthStore } from "#stores/authStore.js";
import { useCartStore } from "#stores/cartStore.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { LogOut, User, X } from "lucide-react";
import React from "react";
import { CategoryNavigation } from "./category-navigation";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const accountLinks = [
  "HESABIM",
  "MÜŞTERİ YORUMLARI",
  "İLETİŞİM"
];

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const { auth } = useAuthStore();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Eden treaty type fix
  const apiAuth = (api as any).auth;

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiAuth["sign-out"].post();
    },
    onSuccess: () => {
      // Reset auth and cart
      auth.reset();
      clearCart();
      queryClient.clear();
      onClose(); // Sidebar'ı kapat
      router.navigate({ to: "/login" });
    },
    onError: (error) => {
      console.error("Logout request failed:", error);
      // Even if logout fails, clear local state
      auth.reset();
      clearCart();
      queryClient.clear();
      onClose(); // Sidebar'ı kapat
      router.navigate({ to: "/login" });
    },
  });

  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
         <img src="/images/image.png" alt="logo" className="h-8" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full relative">
          {/* Categories Navigation Section */}
          <div className="bg-white flex-1 overflow-hidden">
            <CategoryNavigation onClose={onClose} />
          </div>

          {/* Account Links Section - Gray Background */}
          <div className="bg-gray-100 absolute bottom-0 w-full">
            {accountLinks.map((link, index) => (
              <div key={link}>
                <a
                  href="#"
                  className="flex items-center px-6 py-4 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => {
                  }}
                >
                  <span className="text-base font-medium">{link}</span>
                </a>
                {/* Divider - except for last item */}
                {index < accountLinks.length - 1 && (
                  <div className="border-b border-gray-200 mx-6" />
                )}
              </div>
            ))}
          </div>

          {/* Spacer to push user section towards bottom but keep it visible */}
          <div className="flex-1"></div>

          {/* User Section - Bottom but visible */}
          <div className="mb-24 px-3">
            {auth.user ? (
              /* Logged in user */
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Hoşgeldin!
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {auth.user.firstName} {auth.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {auth.user.email}
                    </p>
                  </div>
                </div>
                {/* Logout Icon - Right side of user info */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full ml-2"
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              /* Not logged in */
              <div className="space-y-2">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    router.navigate({ to: "/login" });
                    onClose();
                  }}
                >
                  Üye Girişi
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300"
                  onClick={() => {
                    router.navigate({ to: "/login" });
                    onClose();
                  }}
                >
                  Üye Ol
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

MobileSidebar.displayName = "MobileSidebar"; 