import { InfoBanner } from "#components/layout/info-banner";
import React from "react";
import { CategoryNav } from "./category-nav";
import { Footer } from "./footer";
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header fixed={headerFixed} />
      
      <CategoryNav />
      
      <InfoBanner />
      
      {/* Main Content */}
      <div className={headerFixed ? "mt-20 flex-1" : "flex-1"}>
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

LayoutWithNav.displayName = "LayoutWithNav"; 