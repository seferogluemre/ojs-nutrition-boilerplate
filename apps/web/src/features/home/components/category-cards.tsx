import { Button } from "#components/ui/button";
import { cn } from "#lib/utils";
import React from "react";

interface CategoryCardsProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

const categories = [
  {
    id: 1,
    name: "PROTEİN",
    image: "/images/protein.jpg",
    link: "/kategoriler/protein"
  },
  {
    id: 2,
    name: "VİTAMİNLER",
    image: "/images/vitaminler.jpg",
    link: "/kategoriler/vitaminler"
  },
  {
    id: 3,
    name: "SAĞLIK",
    image: "/images/saglik.jpg",
    link: "/kategoriler/saglik"
  },
  {
    id: 4,
    name: "SPOR GIDALARI",
    image: "/images/spor_gidalari.jpg",
    link: "/kategoriler/spor-gidalari"
  },
  {
    id: 5,
    name: "GIDA",
    image: "/images/gida.jpg",
    link: "/kategoriler/gida"
  },
  {
    id: 6,
    name: "TÜM ÜRÜNLER",
    image: "/images/tüm_ürünler.png",
    link: "/kategoriler/tum-urunler"
  }
];

export const CategoryCards = ({
  className,
  ...props
}: CategoryCardsProps) => {
  return (
    <section
      className={cn(
        "py-12",
        className,
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        {/* Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 justify-items-center">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative w-[384px] h-[167px] max-w-full rounded-2xl overflow-hidden bg-cover bg-center group cursor-pointer transition-shadow duration-300 shadow-lg hover:shadow-xl"
              style={{
                backgroundImage: `url('${category.image}')`,
                backgroundPosition: 'center 50%',
                backgroundSize: 'cover',
              }}
            >
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-black bg-opacity-5"></div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6">
                {/* Category Name - Center-right aligned, top */}
                <div className="flex justify-end items-start flex-1">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 text-end leading-tight mt-4">
                    {category.name}
                  </h3>
                </div>
                
                {/* İNCELE Button - Center-right aligned, bottom */}
                <div className="flex justify-end">
                  <Button
                    className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-full text-sm transition-colors duration-200"
                    onClick={() => {
                      // TODO: Navigate to category page
                      void category.link;
                    }}
                  >
                    İNCELE
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

CategoryCards.displayName = "CategoryCards"; 