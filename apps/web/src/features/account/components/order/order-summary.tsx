import { OrderSummaryProps } from "../../types";

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="bg-white">
      {/* Order Status Section */}
      <div className="mb-6">
        <h4 className="mb-3 text-lg font-semibold text-gray-900">
          {order.status}
        </h4>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{order.deliveryDate} Tarihinde Sipariş Verildi</span>
          <span>•</span>
          <span>{order.orderNumber} numaralı sipariş</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="mb-6 border-gray-200" />

      {/* Products List */}
      <div>
        <h5 className="text-md mb-4 font-medium text-gray-900">
          Sipariş Edilen Ürünler
        </h5>
        <div className="space-y-4">
          {order.products.map((product) => (
            <div
              key={product.id}
              className="flex items-start space-x-4 rounded-lg bg-gray-50 p-4"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h6 className="mb-1 font-medium text-gray-900">
                  {product.name}
                </h6>
                <p className="mb-1 text-sm text-gray-600">{product.price}</p>
                <p className="text-sm text-gray-500">{product.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
