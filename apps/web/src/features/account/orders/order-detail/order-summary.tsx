import { useRouter } from "@tanstack/react-router";
import { OrderSummaryProps } from "../../types";

export function OrderSummary({ order }: OrderSummaryProps) {
  const router = useRouter();

  const handleCommentRedirect = (productId: string) => {
    router.navigate({
      to: `/products/${productId}`,
      search: { comment: 'true' }
    });
  };

  const isDelivered = order.status === "Teslim Edildi";
  return (
    <div className="bg-white">
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

      <hr className="mb-6 border-gray-200" />

      <div>
        <h5 className="text-md mb-4 font-medium text-gray-900">
          Sipariş Edilen Ürünler
        </h5>
        <div className="space-y-4">
          {order.products.map((product) => (
            <div key={product.id} className="space-y-0">
              <div className="flex items-start space-x-4 rounded-lg bg-gray-50 p-4">
                <div className="flex-shrink-0">
                  <img
                    src={"/images/collagen.jpg"}
                    alt={product.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h6 className="mb-1 font-medium text-gray-900">
                    {product.name}
                  </h6>
                  <p className="mb-1 text-sm text-gray-600">{product.price}</p>
                  <p className="text-sm text-gray-500">{product.size}</p>
                
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
