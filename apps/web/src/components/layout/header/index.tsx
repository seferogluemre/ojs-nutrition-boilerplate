import { CartSidebar } from "#components/layout/cart-sidebar";
import { MobileSidebar } from "#components/layout/mobile-sidebar";
import { useDebounce } from "#hooks/use-debounce";
import { api } from "#lib/api.js";
import { cn } from "#lib/utils";
import { useAuthStore } from "#stores/authStore.js";
import { useCartStore } from "#stores/cartStore.js";
import { SearchProps } from "#types/search.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { DesktopHeader } from "./desktop-header";
import { MobileHeader } from "./mobile-header";
import { TabletHeader } from "./tablet-header";

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header
      className={cn(
        "relative flex h-20 items-center justify-between border-b border-gray-200 bg-white",
        "px-4 py-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20",
        fixed && "header-fixed peer/header fixed z-50 w-full shadow-md",
        className,
      )}
      {...props}
    >
      {/* Desktop Layout (lg+) */}
      <DesktopHeader
        user={auth.user}
        cartItemCount={cartItemCount}
        searchQuery={searchQuery}
        searchResults={searchResults}
        isSearchOpen={isSearchOpen}
        isSearchLoading={isSearchLoading}
        searchContainerRef={searchContainerRef}
        onSearchChange={handleSearchChange}
        onSearchItemClick={handleSearchItemClick}
        onCloseSearch={handleCloseSearch}
        onLogout={handleLogout}
        onCartClick={toggleCartSidebar}
      />

      {/* Tablet Layout (md to lg) */}
      <TabletHeader
        user={auth.user}
        cartItemCount={cartItemCount}
        searchQuery={searchQuery}
        searchResults={searchResults}
        isSearchOpen={isSearchOpen}
        isSearchLoading={isSearchLoading}
        searchContainerRef={searchContainerRef}
        onSearchChange={handleSearchChange}
        onSearchItemClick={handleSearchItemClick}
        onCloseSearch={handleCloseSearch}
        onLogout={handleLogout}
        onCartClick={toggleCartSidebar}
      />

      {/* Mobile Layout (md-) */}
      <MobileHeader
        cartItemCount={cartItemCount}
        onMenuClick={toggleMobileSidebar}
        onCartClick={toggleCartSidebar}
      />

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
      />

      <CartSidebar isOpen={isCartSidebarOpen} onClose={closeCartSidebar} />
    </header>
  );
};

Header.displayName = "Header"; 