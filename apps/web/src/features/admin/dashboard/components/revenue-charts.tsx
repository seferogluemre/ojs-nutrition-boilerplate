import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { data } from "../data/data";

export const RevenueChart = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Gelir Analizi</CardTitle>
        <CardDescription>
          Son 12 ayın gelir ve sipariş sayısı karşılaştırması
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₺${value}`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Gelir
                          </span>
                          <span className="font-bold text-muted-foreground">
                            ₺{payload[0].value}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Siparişler
                          </span>
                          <span className="font-bold">
                            {payload[1].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              strokeWidth={2} 
              stroke="hsl(var(--primary))"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              strokeWidth={2} 
              stroke="hsl(var(--muted-foreground))"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};