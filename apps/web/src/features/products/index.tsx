import { Main } from "#components/layout/main";
import { ProductCard } from "./components/product-card";
import { mockProducts } from "./data/mock-products";

export default function Products() {
  return (
    <Main>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">PROTEİN</h1>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Main>
  );
} 