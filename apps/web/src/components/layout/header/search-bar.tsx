import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { SearchProps } from "#types/search.js";
import { Search } from "lucide-react";
import React from "react";
import { SearchDropdown } from "../search-dropdown";

interface SearchBarProps {
  searchQuery: string;
  searchResults: SearchProps[];
  isSearchOpen: boolean;
  isSearchLoading: boolean;
  searchContainerRef: React.RefObject<HTMLDivElement>;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  onSearchItemClick: () => void;
  onCloseSearch: () => void;
  variant?: "desktop" | "tablet" | "mobile";
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  searchResults,
  isSearchOpen,
  isSearchLoading,
  searchContainerRef,
  onSearchChange,
  onSearchFocus,
  onSearchItemClick,
  onCloseSearch,
  variant = "desktop"
}) => {
  const getStyles = () => {
    switch (variant) {
      case "desktop":
        return {
          container: "mx-8 max-w-lg flex-1",
          searchIcon: "absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400",
          input: "w-full rounded-md border border-gray-300 py-2 pl-10 pr-20 focus:border-transparent focus:ring-2 focus:ring-blue-500",
          button: "absolute right-2 top-1/2 h-7 -translate-y-1/2 transform bg-gray-700 px-3 py-1 text-xs text-white hover:bg-gray-800"
        };
      case "tablet":
        return {
          container: "mx-6 max-w-md flex-1",
          searchIcon: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400",
          input: "w-full rounded-md border border-gray-300 bg-white text-gray-900 py-2 pl-9 pr-16 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500",
          button: "absolute right-1 top-1/2 h-6 -translate-y-1/2 transform bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-800"
        };
      default:
        return {
          container: "mx-8 max-w-lg flex-1",
          searchIcon: "absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400",
          input: "w-full rounded-md border border-gray-300 py-2 pl-10 pr-20 focus:border-transparent focus:ring-2 focus:ring-blue-500",
          button: "absolute right-2 top-1/2 h-7 -translate-y-1/2 transform bg-gray-700 px-3 py-1 text-xs text-white hover:bg-gray-800"
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={styles.container} ref={searchContainerRef}>
      <div className="relative">
        <Search className={styles.searchIcon} />
        <Input
          type="text"
          placeholder="Aradığınız ürünü yazınız..."
          className={styles.input}
          value={searchQuery}
          onChange={onSearchChange}
          onFocus={onSearchFocus}
        />
        <Button
          size="sm"
          className={styles.button}
        >
          ARA
        </Button>

        <SearchDropdown
          items={searchResults}
          isLoading={isSearchLoading}
          isOpen={isSearchOpen}
          onItemClick={onSearchItemClick}
          onClose={onCloseSearch}
        />
      </div>
    </div>
  );
};