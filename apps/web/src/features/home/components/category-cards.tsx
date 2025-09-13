import { Button } from "#components/ui/button";
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
    link: "/products?main_category/PROTEIN",
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

  const getApiCategoryMapping = (localCategoryName: string) => {
    const mappings: Record<string, string> = {
      VİTAMİNLER: "VİTAMİN",
      PROTEİN: "PROTEİN", 
      SAĞLIK: "SAĞLIK",
      GIDA: "GIDA",
      "SPOR GIDALARI": "SPOR GIDALARI",
    };
    return mappings[localCategoryName] || localCategoryName;
  };

  const getSubCategoryId = (apiCategories: any[], localCategoryName: string) => {
    const apiCategoryName = getApiCategoryMapping(localCategoryName);
    
    const mainCategory = apiCategories.find(cat => cat.name === apiCategoryName);
    if (!mainCategory) return null;

    const subCategory = mainCategory.children?.find((child: any) => child.products && child.products.length > 0);
    return subCategory?.id || null;
  };
  console.log("data", data);
  useEffect(() => {
    if (data?.data) {
      const updatedCategories = categories.map((cat) => {
        if (cat.name === "TÜM ÜRÜNLER") {
          return {
            ...cat,
            link: `/products`,
          };
        }

        const subCategoryId = getSubCategoryId(data.data, cat.name);
        console.log(`${cat.name} -> SubCategory ID:`, subCategoryId);
        if (subCategoryId) {
          return {
            ...cat,
            id: subCategoryId,
            link: `/products?main_category=${subCategoryId}`,
          };
        }

        const mainCategoryParam = cat.name.toLowerCase().replace(/ /g, "-");
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative h-[167px] w-full max-w-[384px] mx-auto cursor-pointer overflow-hidden rounded-2xl bg-cover bg-center shadow-lg transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
              style={{
                backgroundImage: `url('${category.image}')`,
                backgroundPosition: "center 50%",
                backgroundSize: "cover",
              }}
            >
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-50"></div>

              {/* Content */}
              <div className="relative flex h-full flex-col justify-between p-6">
                {/* Category Name - Center-right aligned, top */}
                <div className="flex flex-1 items-start justify-end">
                  <h3 className="mt-4 text-end text-lg font-bold leading-tight text-white drop-shadow-lg lg:text-xl">
                    {category.name}
                  </h3>
                </div>

                {/* İNCELE Button - Center-right aligned, bottom */}
                <div className="flex justify-end">
                  <Button
                    className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white transform transition-all duration-200 ease-in-out hover:bg-gray-800 hover:scale-110 group-hover:shadow-lg"
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
