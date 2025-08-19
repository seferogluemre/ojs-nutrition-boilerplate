
export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.ReactNode;
}