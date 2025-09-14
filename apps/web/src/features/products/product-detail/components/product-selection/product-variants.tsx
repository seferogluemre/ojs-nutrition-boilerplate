import { cn } from "#lib/utils";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { ProductVariant } from "../../types";

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedFlavor: ProductVariant | null;
  selectedSize: ProductVariant | null;
  onFlavorSelect: (flavor: ProductVariant) => void;
  onSizeSelect: (size: ProductVariant) => void;
}

export function ProductVariants({ 
  variants, 
  selectedFlavor, 
  selectedSize, 
  onFlavorSelect, 
  onSizeSelect 
}: ProductVariantsProps) {
  // Aroma isimlerini icon dosya isimlerine eşleyen fonksiyon
  const getAromaIcon = (aroma: string) => {
    const aromaMap: { [key: string]: string } = {
      'Bisküvi': 'bisküvi.webp',
      'Çikolata': 'çikolata.webp', 
      'Muz': 'muz.webp',
      'Salted Caramel': 'karamel.webp',
      'Choco Nut': 'çokonat.webp',
      'Hindistan Cevizi': 'cake.webp', // fallback
      'Raspberry Cheesecake': 'rasperryChescake.webp',
      'Çilek': 'çilek.webp',
      'Aromasız': 'aromasız.webp',
      'Muhallebi': 'muhallebi.webp',
      'Şeftali': 'seftali.webp',
      'Karpuz': 'karpuz.webp',
      'Limonata': 'limonata.webp',
      'Lemon Cheesecake': 'lemonCheescake.webp',
      'Fruit Fusion': 'fruitfusion.webp',
      'Ahududu': 'ahududu.webp',
      'Yeşil Elma': 'yesilelma.webp',
      'Tigers': 'tigers.webp'
    };

    if (aromaMap[aroma]) {
      return `/icons/${aromaMap[aroma]}`;
    }

    const normalizedAroma = aroma.toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '');

    // Icon dosyalarında ara
    const iconFiles = [
      'bisküvi', 'çikolata', 'muz', 'karamel', 'çokonat', 'çilek', 
      'aromasız', 'muhallebi', 'seftali', 'karpuz', 'limonata', 
      'lemonCheescake', 'fruitfusion', 'ahududu', 'yesilelma', 'tigers',
      'rasperryChescake', 'cake'
    ];

    const matchedIcon = iconFiles.find(icon => 
      icon.toLowerCase().includes(normalizedAroma) || 
      normalizedAroma.includes(icon.toLowerCase())
    );

    return matchedIcon ? `/icons/${matchedIcon}.webp` : '/icons/aromasız.webp';
  };

  const getFlavorStyle = (flavor: ProductVariant, isSelected: boolean) => {
    return {
      backgroundColor: 'transparent',
      borderColor: isSelected ? '#3b82f6' : undefined,
      color: undefined,
    };
  };

  const flavorsWithAroma = variants.filter(v => v.aroma);
  const variantsWithSize = variants.filter(v => v.size);

  // Varsayılan seçimleri ayarla
  useEffect(() => {
    if (flavorsWithAroma.length > 0 && !selectedFlavor) {
      onFlavorSelect(flavorsWithAroma[0]);
    }
    if (variantsWithSize.length > 0 && !selectedSize) {
      onSizeSelect(variantsWithSize[0]);
    }
  }, [flavorsWithAroma, variantsWithSize, selectedFlavor, selectedSize, onFlavorSelect, onSizeSelect]);

  return (
    <div className="space-y-6">
      {/* Flavors Section - Only show if variants exist and have aroma */}
      {flavorsWithAroma.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">AROMA:</h3>
          <div className="flex flex-wrap gap-3">
            {flavorsWithAroma.map((flavor) => (
              <button
                key={flavor.id}
                onClick={() => onFlavorSelect(flavor)}
                disabled={!flavor.is_available}
                className={cn(
                  "relative px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200",
                  "h-[60px] md:h-[65px] flex items-center gap-3 min-w-[140px] md:min-w-[150px]",
                  selectedFlavor?.id === flavor.id
                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900"
                    : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500",
                  !flavor.is_available && "opacity-50 cursor-not-allowed"
                )}
                style={getFlavorStyle(flavor, selectedFlavor?.id === flavor.id)}
              >
                {/* Aroma İkonu */}
                <div className="flex-shrink-0">
                  <img 
                    src={getAromaIcon(flavor.aroma || '')}
                    alt={flavor.aroma}
                    className="w-[50px] h-[50px] object-cover rounded-md"
                    onError={(e) => {
                      // Eğer görsel yüklenmezse fallback kullan
                      (e.target as HTMLImageElement).src = '/icons/aromasız.webp';
                    }}
                  />
                </div>
                
                {/* Aroma Adı */}
                <span className="flex-1 text-xs md:text-sm text-left leading-tight text-gray-900 dark:text-gray-200">{flavor.aroma}</span>
                
                {/* Seçim İşareti */}
                {selectedFlavor?.id === flavor.id && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes Section - Only show if variants exist and have size */}
      {variantsWithSize.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">BOYUT:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {variantsWithSize.map((variant) => (
              <button
                key={variant.id}
                onClick={() => onSizeSelect(variant)}
                className={cn(
                  "relative p-3 md:p-4 rounded-lg border-2 text-center transition-all duration-200",
                  selectedSize?.id === variant.id
                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                )}
              >
                {/* Discount Badge - Middle Top */}
                {variant.price?.discount_percentage && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                    %{variant.price.discount_percentage}
                    <div className="text-[8px] font-normal">İNDİRİM</div>
                  </div>
                )}

                <div className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{variant.size?.pieces} adet</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{variant.size?.total_services} servis</div>

                <div className="mt-2">
                  {variant.price?.discounted_price && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      {variant.price.total_price} TL
                    </div>
                  )}
                  <div className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                    {variant.price?.discounted_price || variant.price?.total_price} TL
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 