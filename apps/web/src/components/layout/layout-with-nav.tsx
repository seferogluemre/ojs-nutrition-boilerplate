import React from "react";
import { CategoryNav } from "./category-nav";
import { Header } from "./header";

interface LayoutWithNavProps {
  children: React.ReactNode;
  headerFixed?: boolean;
}

export const LayoutWithNav = ({ 
  children, 
  headerFixed = false 
}: LayoutWithNavProps) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header fixed={headerFixed} />
      
      {/* Category Navigation - Header ile yapışık */}
      <CategoryNav />
      
      {/* Main Content */}
      <div className={headerFixed ? "mt-16" : ""}>
        {children}
      </div>
    </div>
  );
};

LayoutWithNav.displayName = "LayoutWithNav"; 