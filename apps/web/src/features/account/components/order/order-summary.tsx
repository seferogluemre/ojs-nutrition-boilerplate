interface Product {
  id: number;
  name: string;
  price: string;
  size: string;
  image: string;
}

interface OrderSummaryProps {
  order: {
    orderNumber: string;
    status: string;
    deliveryDate: string;
    products: Product[];
  };
}

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="bg-white">
      {/* Order Status Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">{order.status}</h4>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{order.deliveryDate} Tarihinde Sipariş Verildi</span>
          <span>•</span>
          <span>{order.orderNumber} numaralı sipariş</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 mb-6" />

      {/* Products List */}
      <div>
        <h5 className="text-md font-medium text-gray-900 mb-4">Sipariş Edilen Ürünler</h5>
        <div className="space-y-4">
          {order.products.map((product) => (
            <div key={product.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
              
              {/* Product Details */}
              <div className="flex-1">
                <h6 className="font-medium text-gray-900 mb-1">
                  {product.name}
                </h6>
                <p className="text-sm text-gray-600 mb-1">
                  {product.price}
                </p>
                <p className="text-sm text-gray-500">
                  {product.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 