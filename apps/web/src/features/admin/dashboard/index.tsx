import { MetricsCards } from "./components/metrics-cards";
import { RecentOrders } from "./components/recent-orders";
import { RevenueChart } from "./components/revenue-charts";

export function Dashboard() {
    return <>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                        Son güncelleme: {new Date().toLocaleString('tr-TR')}
                    </p>
                </div>
            </div>

            <MetricsCards />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RevenueChart />
                <div className="col-span-3">
                    <RecentOrders />
                </div>
            </div>
        </div>


    </>
}