import { Main } from "#components/layout/main";
import { BestSellers } from "./components/best-sellers";
import { CategoryCards } from "./components/category-cards";
import { CustomerReviews } from "./components/customer-reviews";
import { HeroBanner } from "./components/hero-banner";
import { SecondaryBanner } from "./components/secondary-banner";

export default function Home() {
  return (
    <>
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
      </Main>
    </>
  );
}


