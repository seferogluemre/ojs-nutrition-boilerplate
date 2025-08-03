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

interface TabletHeaderProps {
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

export const TabletHeader: React.FC<TabletHeaderProps> = ({
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
    <div className="mx-auto hidden w-full max-w-5xl items-center justify-between md:flex lg:hidden">
      {/* Logo - Sol */}
      <div className="flex-shrink-0">
        <div className="flex items-center">
          <img
            src="/images/image.png"
            onClick={() => router.navigate({ to: "/" })}
            alt="logo"
            className="h-8 cursor-pointer"
          />
        </div>
      </div>

      {/* Search Bar - Orta */}
      <SearchBar
        variant="tablet"
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
      <div className="flex flex-shrink-0 items-center space-x-2">
        <AccountDropdown
          variant="tablet"
          user={user}
          onLogout={onLogout}
        />

        <CartButton
          variant="tablet"
          cartItemCount={cartItemCount}
          onClick={onCartClick}
        />
      </div>
    </div>
  );
};