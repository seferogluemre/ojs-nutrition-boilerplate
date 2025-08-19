import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { MetricCardProps } from "../types/types";

const MetricCard = ({ title, value, change, changeType, icon }: MetricCardProps) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
            </CardTitle>
            <div className="text-muted-foreground">
                {icon}
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
                {changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                    {change}
                </span>
                <span className="ml-1">from last month</span>
            </div>
        </CardContent>
    </Card>
);

export const MetricsCards = () => {
    const metrics = [
        {
            title: "Toplam Ürünler",
            value: "2,847",
            change: "+12.5%",
            changeType: 'increase' as const,
            icon: <Package className="h-4 w-4" />
        },
        {
            title: "Toplam Siparişler",
            value: "1,234",
            change: "+8.2%",
            changeType: 'increase' as const,
            icon: <ShoppingCart className="h-4 w-4" />
        },
        {
            title: "Toplam Kullanıcılar",
            value: "5,678",
            change: "+15.3%",
            changeType: 'increase' as const,
            icon: <Users className="h-4 w-4" />
        },
        {
            title: "Aylık Gelir",
            value: "₺45,231",
            change: "-2.1%",
            changeType: 'decrease' as const,
            icon: <DollarSign className="h-4 w-4" />
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
            ))}
        </div>
    );
};