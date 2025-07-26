import { Main } from "#components/layout/main";
import { api } from "#lib/api.js";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./components/product-card";
import { Product } from "./data/mock-products";

export default function Products() {

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.products.get();
      return response.data;
    },
  });

  return (
    <Main>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">PROTEİN</h1>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {data?.data?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Main>
  );
}
