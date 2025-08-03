import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { SearchProps } from "#types/search";
import { Search } from "lucide-react";
import React from "react";
import { SearchDropdown } from "../search-dropdown";

interface MobileSearchBarProps {
  searchQuery: string;
  searchResults: SearchProps[];
  isSearchOpen: boolean;
  isSearchLoading: boolean;
  searchContainerRef: React.RefObject<HTMLDivElement>;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  onSearchItemClick: () => void;
  onCloseSearch: () => void;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  searchQuery,
  searchResults,
  isSearchOpen,
  isSearchLoading,
  searchContainerRef,
  onSearchChange,
  onSearchFocus,
  onSearchItemClick,
  onCloseSearch
}) => {
  return (
    <div className="md:hidden bg-white px-4">
      <div className="relative" ref={searchContainerRef}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rounded-xxl" />
        <Input
          type="text"
          placeholder="ARADIĞINIZ ÜRÜNÜ YAZINIZ..."
          value={searchQuery}
          onChange={onSearchChange}
          onFocus={onSearchFocus}
          className="w-full pl-10 pr-16 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button
          size="lg"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 h-6 text-xs"
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