import { LayoutWithNav } from "#components/layout/layout-with-nav";
import { Main } from "#components/layout/main";
import { HeroBanner } from "./components/hero-banner";

export default function Home() {
  return (
    <LayoutWithNav>
      {/* Hero Banner - Full width, outside Main */}
      <HeroBanner />
      
      <Main>
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


