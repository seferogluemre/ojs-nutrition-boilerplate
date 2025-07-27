interface OrderSummaryProps {
  shippingCost: number;
}

export const OrderSummary = ({ shippingCost }: OrderSummaryProps) => {
  const items = [
    {
      id: 1,
      name: "WHEY PROTEIN",
      variant: "Çilek / 400g",
      price: 1098,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "ARGININE",
      variant: "120g",
      price: 458,
      image: "/placeholder.svg?height=60&width=60",
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + shippingCost;

  return (
    <div className="sticky top-4 rounded-lg bg-gray-50 p-6">
      <h3 className="mb-4 text-lg font-medium">Sipariş Özeti</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="h-12 w-12 rounded-lg bg-blue-100 object-cover"
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.name}</h4>
              <p className="text-xs text-gray-600">{item.variant}</p>
            </div>
            <div className="text-sm font-medium">{item.price} TL</div>
          </div>
        ))}

        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam</span>
              <span>{subtotal.toLocaleString()} TL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kargo</span>
              <span>
                {shippingCost === 0 ? "Ücretsiz" : `${shippingCost} TL`}
              </span>
            </div>
          </div>

          <div className="mt-2 border-t border-gray-200 pt-2">
            <div className="flex justify-between font-semibold">
              <span>Toplam</span>
              <span>{total.toLocaleString()} TL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
