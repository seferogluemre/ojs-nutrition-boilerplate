import { cn } from "#lib/utils";
import { useState } from "react";

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const ojsNutritionLinks = [
    {
      label: "İletişim",
      href: "/contact"
    },
    {
      label: "Hakkımızda",
      href: "/about"
    },
    {
      label: "Sıkça Sorulan Sorular",
      href: "/sss"
    },
  ];

  const categoryLinks = [
    {
      label: "Protein",
      href: "/products?main_category=1142dc02-2a2c-423b-bae8-c9232e902be1"
    },
    {
      label: "Spor Gıdaları",
      href: "/products?main_category=97e0c3d2-a370-4ec1-bedf-5eb72e0e7902"
    },
    {
      label: "Sağlık",
      href: "/products?main_category=a7909d8b-1abc-4f14-9086-469115d40051"
    },
    "Gıda",
    {
      label: "Vitamin",
      href: "/products?main_category=d01c960b-7c46-475d-980e-7ba6b6a5a8d7"
    },
    {
      label: "Tüm Ürünler",
      href: "/products"
    },
    {
      label: "Gıda",
      href: "/products?main_category=66c6462b-aa91-4c1b-b757-c86f0c11665a"
    },
  ];

  const popularProducts = [
    "Whey Protein",
    "Cream of Rice", 
    "Creatine",
    "BCAA+",
    "Pre-Workout",
    "Fitness Ekseri",
    "Collagen",
    "Çiçek Vitamin Desteği",
    "ZMA"
  ];

  const getHref = (linkText: string) => {
    switch (linkText) {
      case "İletişim":
        return "/contact";
      case "Hakkımızda":
        return "/about";
      case "Sıkça Sorulan Sorular":
        return "/sss";
      default:
        return "#";
    }
  };

  return (
    <footer className={cn("text-white", className)} style={{ backgroundColor: '#222222' }}>
      {/* Top Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left - Stars and Main Title */}
          <div className="lg:max-w-md">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">★</span>
              ))}
              <span className="text-gray-300 text-sm ml-2">(140.000+)</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold leading-tight">
              LABORATUVAR TESTLİ ÜRÜNLER<br />
              AYNI GÜN & ÜCRETSİZ KARGO<br />
              MEMNUNİYET GARANTİSİ
            </h2>
          </div>

          {/* Right - Description Text */}
          <div className="lg:max-w-md">
            <p className="text-gray-300 text-sm leading-relaxed">
              200.000'den fazla ürün yorumumuza dayanarak, 
              ürünlerimizi seveceğinize eminiz. Eğer herhangi 
              bir sebeple memnun kalmazsanız, bizimle iletişime 
              geçtiğinde çözüme kavuşturacağız.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section - 3 Columns */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-8">
          {/* Desktop/Tablet View */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {/* Column 1: OJS Nutrition */}
            <div>
              <h3 className="text-lg font-semibold mb-4">OJS NUTRITION</h3>
              <ul className="space-y-2">
                {ojsNutritionLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">KATEGORİLER</h3>
              <ul className="space-y-2">
                {categoryLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Popular Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4">POPÜLER ÜRÜNLER</h3>
              <ul className="space-y-2">
                {popularProducts.map((product, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                      {product}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile Accordion View */}
          <div className="lg:hidden space-y-4">
            {/* OJS Nutrition Accordion */}
            <div className="border-b border-gray-700 pb-4">
              <button
                onClick={() => toggleAccordion('ojs')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold">OJS NUTRITION</h3>
                <span className="text-white text-xl font-bold w-6 h-6 flex items-center justify-center">
                  {openAccordions['ojs'] ? "-" : "+"}
                </span>
              </button>
              {openAccordions['ojs'] && (
                <ul className="mt-4 space-y-2">
                  {ojsNutritionLinks.map((link, index) => (
                    <li key={index}>
                      <a href={getHref(link)} className="text-gray-300 hover:text-white transition-colors text-sm block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Categories Accordion */}
            <div className="border-b border-gray-700 pb-4">
              <button
                onClick={() => toggleAccordion('categories')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold">KATEGORİLER</h3>
                <span className="text-white text-xl font-bold w-6 h-6 flex items-center justify-center">
                  {openAccordions['categories'] ? "-" : "+"}
                </span>
              </button>
              {openAccordions['categories'] && (
                <ul className="mt-4 space-y-2">
                  {categoryLinks.map((link, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Popular Products Accordion */}
            <div className="pb-4">
              <button
                onClick={() => toggleAccordion('products')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold">POPÜLER ÜRÜNLER</h3>
                <span className="text-white text-xl font-bold w-6 h-6 flex items-center justify-center">
                  {openAccordions['products'] ? "-" : "+"}
                </span>
              </button>
              {openAccordions['products'] && (
                <ul className="mt-4 space-y-2">
                  {popularProducts.map((product, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm block">
                        {product}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-400 text-sm">
            Copyright © - Tüm Hakları Saklıdır
          </p>
        </div>
      </div>
    </footer>
  );
}; 