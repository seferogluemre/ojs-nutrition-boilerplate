import { Main } from "#components/layout/main";
import { Button } from "#components/ui/button";
import { cn } from "#lib/utils";
import { useParams } from "@tanstack/react-router";
import { Award, Check, Minus, Plus, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import { useState } from "react";
import { mockProducts, ProductBadge, ProductFlavor, ProductSize } from "../data/mock-products";

export default function ProductDetail() {
  const { productId } = useParams({ from: "/_authenticated/products/$productId" });
  
  // Find product by ID
  const product = mockProducts.find(p => p.id === productId);
  
  // State management
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor | null>(
    product?.flavors?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    product?.sizes?.find(s => s.isRecommended) || product?.sizes?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <Main>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
            <p className="text-gray-600">Aradığınız ürün mevcut değil.</p>
          </div>
        </div>
      </Main>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Half star (if needed)
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    
    return stars;
  };

  const getBadgeColor = (color: ProductBadge["color"]) => {
    const colors = {
      gray: "bg-gray-100 text-gray-700 border-gray-200",
      green: "bg-green-100 text-green-700 border-green-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      red: "bg-red-100 text-red-700 border-red-200",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[color];
  };

  const getFlavorStyle = (flavor: ProductFlavor, isSelected: boolean) => {
    return {
      backgroundColor: '#ffffff',
      borderColor: isSelected ? '#3b82f6' : '#d1d5db',
      color: '#374151',
    };
  };

  const getCurrentPrice = () => {
    return selectedSize?.price || product.price;
  };

  const getOldPrice = () => {
    return selectedSize?.oldPrice || product.oldPrice;
  };

  const getServingPrice = () => {
    const price = getCurrentPrice();
    const servings = selectedSize?.servings || 16;
    return (price / servings).toFixed(2);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const getBenefitIcon = (iconName: string) => {
    const icons = {
      truck: Truck,
      shield: Shield, 
      award: Award,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Truck;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <Main>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Column - Product Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-md lg:max-w-lg">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          {/* Right Column - Product Info */}
          <div className="flex flex-col space-y-4">
            
            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            
            {/* Short Description */}
            <h2 className="text-lg lg:text-xl text-gray-600 font-medium">
              {product.shortDescription}
            </h2>
            
            {/* Rating & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600 font-medium">
                {product.reviewCount} Yorum
              </span>
            </div>
            
            {/* Product Badges */}
            <div className="flex flex-wrap gap-3">
              {product.badges.map((badge) => (
                <span
                  key={badge.id}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium border",
                    getBadgeColor(badge.color)
                  )}
                >
                  {badge.text}
                </span>
              ))}
            </div>
            
            {/* HR Divider */}
            <hr className="border-gray-200" />
            
            {/* Flavors Section */}
            {product.flavors && product.flavors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AROMA:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.flavors.map((flavor) => (
                    <button
                      key={flavor.id}
                      onClick={() => setSelectedFlavor(flavor)}
                      disabled={!flavor.available}
                      className={cn(
                        "relative ps-2  rounded-lg border-2 text-sm font-medium transition-all duration-200",
                        "h-[35px] flex items-center justify-between min-w-[120px]",
                        selectedFlavor?.id === flavor.id 
                          ? "border-blue-500 ring-2 ring-blue-200" 
                          : "border-gray-300 hover:border-gray-400",
                        !flavor.available && "opacity-50 cursor-not-allowed"
                      )}
                      style={getFlavorStyle(flavor, selectedFlavor?.id === flavor.id)}
                    >
                      <span className="flex-1 text-sm text-center pr-2">{flavor.name}</span>
                      <div 
                        className="w-8 h-full rounded-r-md flex-shrink-0" 
                        style={{ backgroundColor: flavor.color }}
                      ></div>
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
            
            {/* Sizes Section */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">BOYUT:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "relative p-4 rounded-lg border-2 text-center transition-all duration-200",
                        selectedSize?.id === size.id 
                          ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50" 
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                        {/* Discount Badge - Middle Top */}
                        {size.discountPercentage && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                            %{size.discountPercentage}
                            <div className="text-[8px] font-normal">İNDİRİM</div>
                          </div>
                        )}
                        
                        <div className="font-bold text-gray-900">{size.weight}</div>
                        <div className="text-sm text-gray-600">{size.servings} servis</div>
                        
                        <div className="mt-2">
                          {size.oldPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              {size.oldPrice} TL
                            </div>
                          )}
                          <div className="font-bold text-gray-900">
                            {size.price} TL
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Price Section */}
              <div className="bg-white p-3 rounded-lg  border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {getCurrentPrice()} TL
                    {getOldPrice() && (
                      <span className="text-lg text-gray-500 line-through ml-3">
                        {getOldPrice()} TL
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Servis başına</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {getServingPrice()} TL
                    </div>
                  </div>
                </div>
                
                {/* Quantity and Add to Cart */}
                <div className="flex items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-[50px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white py-3 px-6 text-lg font-semibold">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    SEPETE EKLE
                  </Button>
                </div>
              </div>
              
              {/* Benefits Section */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                {product.benefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2 text-gray-600">
                      {getBenefitIcon(benefit.icon)}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {benefit.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {benefit.description}
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </div>
      </Main>
    );
} 