import { LayoutWithNav } from "#components/layout/layout-with-nav";
import { Main } from "#components/layout/main";
import { BestSellers } from "./components/best-sellers";
import { CategoryCards } from "./components/category-cards";
import { CustomerReviews } from "./components/customer-reviews";
import { HeroBanner } from "./components/hero-banner";
import { SecondaryBanner } from "./components/secondary-banner";

export default function Home() {
  return (
    <LayoutWithNav>
      {/* Hero Banner - Full width, outside Main */}
      <HeroBanner />
      
      <Main>
        {/* Category Cards Section */}
        <CategoryCards />
        
        {/* Best Sellers Section */}
        <BestSellers />
      </Main>
      
      {/* Secondary Banner - Full width, outside Main */}
      <SecondaryBanner />
      
      <Main>
        {/* Customer Reviews Section */}
        <CustomerReviews />
        
        {/* Anasayfa içeriği buraya gelecek */}
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8">OJS NUTRITION</h1>
          <p className="text-center text-gray-600 mb-8">
            Anasayfa içeriği hazırlanıyor...
          </p>
        </div>
      </Main>
    </LayoutWithNav>
  );
}


