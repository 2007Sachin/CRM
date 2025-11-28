import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { mockUsers } from '../data/mockData';
import { TrendingUp } from 'lucide-react';

const FunnelChart = () => {
    // 1. Calculate Metrics
    const totalSignups = mockUsers.length;
    const activeTrials = mockUsers.filter(u => u.plan === 'Free' && u.usage_count > 0).length;
    const paidCustomers = mockUsers.filter(u => u.plan === 'Premium').length;

    const conversionRate = ((paidCustomers / totalSignups) * 100).toFixed(1);

    const data = [
        { name: 'Total Signups', value: totalSignups, color: '#3b82f6' },
        { name: 'Active Trials', value: activeTrials, color: '#60a5fa' },
        { name: 'Paid Customers', value: paidCustomers, color: '#f59e0b' }, // Gold
    ];

    return (
        <Card className="col-span-1 md:col-span-3 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">Conversion Funnel</CardTitle>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-8">

                {/* Chart Section */}
                <div className="h-[250px] w-full md:w-3/4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={data}
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={100}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                            />
                            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Summary Section */}
                <div className="w-full md:w-1/4 flex flex-col items-center justify-center p-6 bg-muted/20 rounded-xl border border-border/50">
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Conversion Rate</div>
                    <div className="text-5xl font-bold text-emerald-400">{conversionRate}%</div>
                    <p className="text-xs text-center mt-4 text-muted-foreground">
                        {paidCustomers} paying users out of {totalSignups} total signups.
                    </p>
                </div>

            </CardContent>
        </Card>
    );
};

export default FunnelChart;
