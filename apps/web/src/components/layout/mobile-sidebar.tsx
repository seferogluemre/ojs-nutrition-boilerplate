import { Button } from "#components/ui/button";
import { cn } from "#lib/utils";
import { ChevronRight, X } from "lucide-react";
import React from "react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  "PROTEİN",
  "SPOR GIDALARI", 
  "SAĞLIK",
  "GIDA",
  "VİTAMİN",
  "TÜM ÜRÜNLER"
];

const accountLinks = [
  "HESABIM",
  "MÜŞTERİ YORUMLARI",
  "İLETİŞİM"
];

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
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
        <div className="flex flex-col h-full">
          {/* Categories Section - White Background */}
          <div className="bg-white">
            {categories.map((category, index) => (
              <div key={category}>
                <a
                  href="#"
                  className="flex items-center justify-between px-6 py-4 text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => {
                    // Handle category click
                    // TODO: Navigate to category page
                  }}
                >
                  <span className="text-base font-medium">{category}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </a>
                {/* Divider - except for last item */}
                {index < categories.length - 1 && (
                  <div className="border-b border-gray-100 mx-6" />
                )}
              </div>
            ))}
          </div>

          {/* Account Links Section - Gray Background */}
          <div className="bg-gray-100 mt-4">
            {accountLinks.map((link, index) => (
              <div key={link}>
                <a
                  href="#"
                  className="flex items-center px-6 py-4 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => {
                    // Handle account link click
                    // TODO: Navigate to account page
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
        </div>
      </div>
    </>
  );
};

MobileSidebar.displayName = "MobileSidebar"; 