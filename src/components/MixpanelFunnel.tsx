import { useState, useEffect } from 'react';
import { Clock, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { api } from '../services/api';

const InsightCard = ({ title, value, icon: Icon, subtext, color }: any) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg bg-opacity-10", color.replace('text-', 'bg-'))}>
                    <Icon className={cn("h-5 w-5", color)} />
                </div>
                <span className={cn("text-2xl font-bold", color)}>{value}</span>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-300">{title}</p>
                <p className="text-xs text-slate-500 mt-1">{subtext}</p>
            </div>
        </CardContent>
    </Card>
);

const MixpanelFunnel = () => {
    const [funnelData, setFunnelData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFunnelData = async () => {
            try {
                const data = await api.getAnalyticsFunnel();
                setFunnelData(data);
            } catch (error) {
                console.error('Error fetching funnel data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFunnelData();
    }, []);

    if (loading) {
        return <div className="text-slate-400">Loading funnel data...</div>;
    }

    if (!funnelData) {
        return <div className="text-red-400">Failed to load funnel data</div>;
    }

    const totalSignups = funnelData.signups || 0;
    const activatedUsers = funnelData.trials || 0;
    const paidUsers = funnelData.paid || 0;

    const dropOffRate = totalSignups > 0 ? ((totalSignups - paidUsers) / totalSignups * 100).toFixed(0) : 0;
    const revenueOpportunity = (totalSignups - paidUsers) * 50;

    // Chart Data
    const chartData = [
        {
            stage: 'Signups',
            users: totalSignups,
            fill: '#3b82f6',
            conversion: '100%'
        },
        {
            stage: 'Active Trials',
            users: activatedUsers,
            fill: '#8b5cf6',
            conversion: totalSignups > 0 ? `${((activatedUsers / totalSignups) * 100).toFixed(0)}%` : '0%'
        },
        {
            stage: 'Paid',
            users: paidUsers,
            fill: '#10b981',
            conversion: totalSignups > 0 ? `${((paidUsers / totalSignups) * 100).toFixed(0)}%` : '0%'
        }
    ];

    return (
        <div className="w-full space-y-6">

            {/* 1. Insights Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InsightCard
                    title="Avg Time to Convert"
                    value="3.2 Days"
                    icon={Clock}
                    subtext="Based on last 30 days"
                    color="text-blue-400"
                />
                <InsightCard
                    title="Total Drop-off Rate"
                    value={`${dropOffRate}%`}
                    icon={TrendingDown}
                    subtext="Biggest drop at 'Active Trial' stage"
                    color="text-purple-400"
                />
                <InsightCard
                    title="Revenue Opportunity"
                    value={`$${revenueOpportunity.toLocaleString()}`}
                    icon={DollarSign}
                    subtext="Potential revenue from lost leads"
                    color="text-emerald-400"
                />
            </div>

            {/* 2. Funnel Chart */}
            <Card className="border-slate-800 bg-slate-900">
                <CardContent className="p-8">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="stage"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                                />
                                <Bar dataKey="users" radius={[4, 4, 0, 0]} barSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                    <LabelList dataKey="conversion" position="top" fill="#f8fafc" fontSize={12} fontWeight="bold" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MixpanelFunnel;
