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
import { useDebounce } from "#hooks/use-debounce";
import { api } from "#lib/api.js";
import { cn } from "#lib/utils";
import { useAuthStore } from "#stores/authStore.js";
import { useCartStore } from "#stores/cartStore.js";
import { SearchProps } from "#types/search.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, ShoppingCart, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { SearchDropdown } from "./search-dropdown";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Header = ({ className, fixed, ...props }: HeaderProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const { auth } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchProps[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: searchData } = useQuery({
    queryKey: ["search-products", debouncedSearchQuery],
    queryFn: async () => {
      if (debouncedSearchQuery.length < 2) return { data: [] };

      const response = await api.products.get({
        query: { search: debouncedSearchQuery },
      });
      return response.data;
    },
    enabled: debouncedSearchQuery.length >= 2,
  });

  // Handle search data changes
  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData?.data || []);
      setIsSearchLoading(false);
    }
  }, [searchData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchQuery(value);

    if (value.length >= 2) {
      setIsSearchLoading(true);
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
      setSearchResults([]);
    }
  };

  const handleSearchItemClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await api.auth["sign-out"].post();
    },
    onSuccess: () => {
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
        "relative flex h-20 items-center justify-between border-b border-gray-200 bg-white",
        // Responsive padding - tutarlı ortalama için + vertical padding eklendi
        "px-4 py-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20",
        fixed && "header-fixed peer/header fixed z-50 w-full shadow-md",
        className,
      )}
      {...props}
    >
      {/* Desktop Layout (lg+) */}
      <div className="mx-auto hidden w-full max-w-7xl items-center justify-between lg:flex">
        {/* Logo - Sol */}
        <div className="flex-shrink-0">
          <div className="flex items-center">
            <img
              src="/images/image.png"
              onClick={() => router.navigate({ to: "/" })}
              alt="logo"
              className="h-10"
            />
          </div>
        </div>

        {/* Search Bar - Orta, esnek genişlik */}
        <div className="mx-8 max-w-lg flex-1" ref={searchContainerRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Aradığınız ürünü yazınız..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-20 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
            />
            <Button
              size="sm"
              className="absolute right-2 top-1/2 h-7 -translate-y-1/2 transform bg-gray-700 px-3 py-1 text-xs text-white hover:bg-gray-800"
            >
              ARA
            </Button>

            <SearchDropdown
              items={searchResults}
              isLoading={isSearchLoading}
              isOpen={isSearchOpen}
              onItemClick={handleSearchItemClick}
              onClose={handleCloseSearch}
            />
          </div>
        </div>

        {/* Account & Cart - Sağ */}
        <div className="flex flex-shrink-0 items-center space-x-4">
          {/* Hesabım Button - Border'lı ve dropdown oklı */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex h-10 items-center space-x-2 border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                <User className="h-5 w-5 text-gray-600" />
                <div className="flex flex-col items-start">
                  {auth.user ? (
                    <>
                      <span className="text-xs text-gray-500">
                        {auth.user.firstName} {auth.user.lastName}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-gray-700">HESAP</span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-[9999] w-40"
              sideOffset={5}
            >
              {auth.user ? (
                <>
                  <DropdownMenuItem className="border-b border-gray-300 text-center">
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

          {/* Sepet Button - Gri background'lu */}
          <Button
            size="sm"
            className="relative flex h-10 items-center space-x-2 bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            onClick={toggleCartSidebar}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium">SEPET</span>
            {/* Cart Badge */}
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {cartItemCount}
            </span>
          </Button>
        </div>
      </div>

      {/* Tablet Layout (md-lg) */}
      <div className="mx-auto hidden w-full max-w-5xl items-center justify-between md:flex lg:hidden">
        {/* Logo - Sol */}
        <div className="flex-shrink-0">
          <div className="flex items-center">
            <img
              src="/images/image.png"
              onClick={() => router.navigate({ to: "/" })}
              alt="logo"
              className="h-8"
            />
          </div>
        </div>

        {/* Search Bar - Orta */}
        <div className="mx-6 max-w-md flex-1" ref={searchContainerRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Aradığınız ürünü yazınız..."
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-16 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 h-6 -translate-y-1/2 transform bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-800"
            >
              ARA
            </Button>

            <SearchDropdown
              items={searchResults}
              isLoading={isSearchLoading}
              isOpen={isSearchOpen}
              onItemClick={handleSearchItemClick}
              onClose={handleCloseSearch}
            />
          </div>
        </div>

        {/* Account & Cart - Sağ */}
        <div className="flex flex-shrink-0 items-center space-x-2">
          {/* Hesabım Button - Tablet için kompakt */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex h-9 items-center space-x-1 border-gray-300 px-3 py-2 hover:bg-gray-50"
              >
                <User className="h-4 w-4 text-gray-600" />
                <div className="flex flex-col items-start">
                  {auth.user ? (
                    <>
                      <span className="text-xs text-gray-500">
                        {auth.user.firstName} {auth.user.lastName}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-medium text-gray-700">
                      HESAP
                    </span>
                  )}
                </div>
                <ChevronDown className="h-3 w-3 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-[9999] w-40"
              sideOffset={5}
            >
              {auth.user ? (
                <>
                  <DropdownMenuItem className="border-b border-gray-300 text-center">
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
                  <DropdownMenuItem className="border-b border-gray-300 text-center">
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
            className="relative flex h-9 items-center space-x-1 bg-gray-600 px-3 py-2 text-white hover:bg-gray-700"
            onClick={toggleCartSidebar}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">SEPET</span>
            {/* Cart Badge */}
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {cartItemCount}
            </span>
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex w-full items-center justify-between md:hidden">
        <Button variant="ghost" size="sm" onClick={toggleMobileSidebar}>
          <Menu className="h-7 w-7 stroke-2" />
        </Button>

        <div className="flex flex-1 justify-center">
          <img
            src="/images/image.png"
            alt="logo"
            className="h-8"
            onClick={() => router.navigate({ to: "/" })}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="relative"
          onClick={toggleCartSidebar}
        >
          <ShoppingCart className="h-7 w-7 stroke-2" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white">
            {cartItemCount}
          </span>
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartSidebarOpen} onClose={closeCartSidebar} />
    </header>
  );
};

Header.displayName = "Header";
