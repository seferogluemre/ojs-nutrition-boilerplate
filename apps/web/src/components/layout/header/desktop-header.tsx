import { ThemeSwitch } from "#components/theme-switch";
import { SearchProps } from "#types/search.js";
import { useRouter } from "@tanstack/react-router";
import React from "react";
import { AccountDropdown } from "./account-dropdown";
import { CartButton } from "./cart-button";
import { SearchBar } from "./search-bar";

interface User {
  firstName?: string;
  lastName?: string;
}

interface DesktopHeaderProps {
  user: User | null;
  cartItemCount: number;
  searchQuery: string;
  searchResults: SearchProps[];
  isSearchOpen: boolean;
  isSearchLoading: boolean;
  searchContainerRef: React.RefObject<HTMLDivElement>;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchItemClick: () => void;
  onCloseSearch: () => void;
  onLogout: () => void;
  onCartClick: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  user,
  cartItemCount,
  searchQuery,
  searchResults,
  isSearchOpen,
  isSearchLoading,
  searchContainerRef,
  onSearchChange,
  onSearchItemClick,
  onCloseSearch,
  onLogout,
  onCartClick
}) => {
  const router = useRouter();

  return (
    <div className="mx-auto hidden w-full max-w-7xl items-center justify-between lg:flex">
      {/* Logo - Sol */}
      <div className="flex-shrink-0">
        <div className="flex items-center">
          <img
            src="/images/image.png"
            onClick={() => router.navigate({ to: "/" })}
            alt="logo"
            className="h-10 cursor-pointer"
          />
        </div>
      </div>

      {/* Search Bar - Orta */}
      <SearchBar
        variant="desktop"
        searchQuery={searchQuery}
        searchResults={searchResults}
        isSearchOpen={isSearchOpen}
        isSearchLoading={isSearchLoading}
        searchContainerRef={searchContainerRef}
        onSearchChange={onSearchChange}
        onSearchFocus={() => searchQuery.length >= 2}
        onSearchItemClick={onSearchItemClick}
        onCloseSearch={onCloseSearch}
      />

      {/* Account & Cart - Sağ */}
      <div className="flex items-center space-x-3">
        <ThemeSwitch />
        
        <AccountDropdown
          variant="desktop"
          user={user}
          onLogout={onLogout}
        />

        <CartButton
          variant="desktop"
          cartItemCount={cartItemCount}
          onClick={onCartClick}
        />
      </div>
    </div>
  );
};