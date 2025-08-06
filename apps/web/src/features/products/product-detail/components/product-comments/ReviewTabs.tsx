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
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          {tab.icon}
          {tab.label}
          <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {getTabCount(tab.id)}
          </span>
        </button>
      ))}
    </div>
  );
}