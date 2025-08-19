import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { orders } from "../data/data";
import { Order } from "../types/types";

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'shipped':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'pending':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'delivered':
      return 'Teslim Edildi';
    case 'shipped':
      return 'Kargoda';
    case 'processing':
      return 'Hazırlanıyor';
    case 'pending':
      return 'Beklemede';
    case 'cancelled':
      return 'İptal Edildi';
    default:
      return status;
  }
};

export const RecentOrders = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Siparişler</CardTitle>
        <CardDescription>
          En son gelen {orders.length} sipariş
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={order.customer.avatar} />
                  <AvatarFallback>
                    {order.customer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.customer.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sipariş {order.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right min-w-0">
                  <p className="text-sm font-semibold text-foreground">{order.amount}</p>
                  <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};