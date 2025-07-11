import { Button } from "#components/ui/button";
import { cn } from "#lib/utils";
import { Minus, Plus, Trash2, X } from "lucide-react";
import React from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock cart data - Bu daha sonra gerçek data ile değiştirilecek
const cartItems = [
  {
    id: 1,
    name: "COLLAGEN",
    flavor: "Ahududu",
    weight: "250g",
    price: 499,
    quantity: 1,
    image: "/images/collagen.jpg" // Placeholder image
  },
  // İkinci ürün örneği
  {
    id: 2,
    name: "WHEY PROTEIN",
    flavor: "Çikolata",
    weight: "1000g", 
    price: 299,
    quantity: 2,
    image: "/images/collagen.jpg" // Placeholder image
  }
];

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  // Calculate total
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Quantity handlers (mock functions)
  const increaseQuantity = (id: number) => {
    // TODO: Implement increase quantity logic
    void id;
  };

  const decreaseQuantity = (id: number) => {
    // TODO: Implement decrease quantity logic
    void id;
  };

  const removeItem = (id: number) => {
    // TODO: Implement remove item logic
    void id;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">SEPETİM</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-600">{item.flavor}</p>
                      <p className="text-xs text-gray-600">{item.weight}</p>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{item.price * item.quantity} TL</p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-end">
                    <div className="flex items-center space-x-2">
                      {/* Sol taraf: çöp kutusu (adet=1) veya minus (adet>1) */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => item.quantity === 1 ? removeItem(item.id) : decreaseQuantity(item.id)}
                        className="p-1 h-7 w-7"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3 h-3" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </Button>
                      
                      <span className="text-sm font-medium px-2">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => increaseQuantity(item.id)}
                        className="p-1 h-7 w-7"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t  p-4 pb-20 space-y-3 mt-auto">
            {/* Total */}
            <div className="text-center">
              <p className="text-lg text-end font-bold text-gray-900">TOPLAM {totalAmount} TL</p>
            </div>

            {/* Continue Button */}
            <Button 
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 text-base"
              onClick={() => {
                // TODO: Handle checkout process
              }}
            >
              DEVAM ET ▶
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

CartSidebar.displayName = "CartSidebar"; 