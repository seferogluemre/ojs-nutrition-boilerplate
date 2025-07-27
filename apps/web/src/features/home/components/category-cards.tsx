import { Button } from "#components/ui/button";
import { api } from "#lib/api.js";
import { cn } from "#lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

interface CategoryCardsProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

export const categoriesData = [
  {
    id: "1",
    name: "PROTEİN",
    image: "/images/protein.jpg",
    link: "/products?main_category/protein",
  },
  {
    id: "2",
    name: "VİTAMİNLER",
    image: "/images/vitaminler.jpg",
    link: "/products?main_category/vitaminler",
  },
  {
    id: "3",
    name: "SAĞLIK",
    image: "/images/saglik.jpg",
    link: "/products?main_category/saglik",
  },
  {
    id: "4",
    name: "SPOR GIDALARI",
    image: "/images/spor_gidalari.jpg",
    link: "/products?main_category/spor-gidalari",
  },
  {
    id: "5",
    name: "GIDA",
    image: "/images/gida.jpg",
    link: "/products?main_category/gida",
  },
  {
    id: "6",
    name: "TÜM ÜRÜNLER",
    image: "/images/tüm_ürünler.png",
    link: "/products",
  },
];

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  link: string;
}

export const CategoryCards = ({ className, ...props }: CategoryCardsProps) => {
  const router = useRouter();

  const [apiCategories, setApiCategories] = useState([]);
  const [categories, setCategories] = useState<CategoryItem[]>(categoriesData);

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.categories.get();
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  const getApiCategoryName = (localCategoryName: string) => {
    const mappings = {
      VİTAMİNLER: "VİTAMİN",
      PROTEİN: "PROTEİN",
      SAĞLIK: "SAĞLIK",
      GIDA: "GIDA",
      "SPOR GIDALARI": "SPOR GIDALARI",
      "TÜM ÜRÜNLER": "TÜM ÜRÜNLER",
    };
    return mappings[localCategoryName] || localCategoryName;
  };

  useEffect(() => {
    if (data?.data) {
      const updatedCategories = categories.map((cat) => {
        const matchingApiCategory = data?.data.find(
          (apiCat) => apiCat.name === getApiCategoryName(cat.name),
        );
        if (matchingApiCategory) {
          return {
            ...cat,
            id: matchingApiCategory.id,
            link: `/products?main_category=${matchingApiCategory.id}`,
          };
        }
        const mainCategoryParam = cat.id.toLowerCase().replace(/ /g, "-");
        return {
          ...cat,
          link: `/products?main_category=${mainCategoryParam}`,
        };
      });
      
      setCategories(updatedCategories);
    }
  }, [data?.data]);

  return (
    <section className={cn("py-12", className)} {...props}>
      <div className="container mx-auto px-4">
        {/* Grid Layout */}
        <div className="grid grid-cols-2 justify-items-center gap-4 lg:grid-cols-3 lg:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative h-[167px] w-[384px] max-w-full cursor-pointer overflow-hidden rounded-2xl bg-cover bg-center shadow-lg transition-shadow duration-300 hover:shadow-xl"
              style={{
                backgroundImage: `url('${category.image}')`,
                backgroundPosition: "center 50%",
                backgroundSize: "cover",
              }}
            >
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-black bg-opacity-5"></div>

              {/* Content */}
              <div className="relative flex h-full flex-col justify-between p-6">
                {/* Category Name - Center-right aligned, top */}
                <div className="flex flex-1 items-start justify-end">
                  <h3 className="mt-4 text-end text-lg font-bold leading-tight text-gray-900 lg:text-xl">
                    {category.name}
                  </h3>
                </div>

                {/* İNCELE Button - Center-right aligned, bottom */}
                <div className="flex justify-end">
                  <Button
                    className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-800"
                    onClick={() => {
                      router.navigate({
                        to: category.link,
                      });
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
