import { useRecentlyViewed } from "#hooks";
import { ProductCard } from "../../components/product-card";

export const RecentlyViewedProducts = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Son Görüntülenenler
        </h2>
        <p className="text-gray-600">
          Yakın zamanda incelediğiniz ürünler
        </p>
      </div>
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recentlyViewed.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            className="h-[320px] md:h-[360px] lg:h-[400px]"
          />
        ))}
      </div>
    </section>
  );
}; 