import { Image, Star } from "lucide-react";
import * as React from "react";

interface TabType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ReviewTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  reviewsWithoutImagesCount: number;
  reviewsWithImagesCount: number;
}

export function ReviewTabs({ 
  activeTab, 
  onTabChange, 
  reviewsWithoutImagesCount, 
  reviewsWithImagesCount 
}: ReviewTabsProps) {
  const tabs: TabType[] = [
    {
      id: "all",
      label: "Değerlendirmeler",
      icon: <Star className="w-4 h-4" />
    },
    {
      id: "with-images",
      label: "Görselli Değerlendirmeler", 
      icon: <Image className="w-4 h-4" />
    }
  ];

  const getTabCount = (tabId: string) => {
    return tabId === "with-images" ? reviewsWithImagesCount : reviewsWithoutImagesCount;
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full max-w-full overflow-hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-md h-8 flex-1 min-w-0 text-xs sm:text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm dark:shadow-none"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {tab.icon}
          <span className="truncate">{tab.label}</span>
          <span className="ml-0.5 sm:ml-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
            {getTabCount(tab.id)}
          </span>
        </button>
      ))}
    </div>
  );
}