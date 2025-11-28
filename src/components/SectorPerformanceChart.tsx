import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lightbulb } from 'lucide-react';
import { api } from '../services/api';

const COLORS = {
    'BFSI': '#3b82f6', // Blue
    'Health Tech': '#14b8a6', // Teal
    'Ecommerce': '#f97316', // Orange
    'EdTech': '#8b5cf6', // Purple
    'Hospitality': '#ec4899' // Pink
};

const SectorPerformanceChart = () => {
    const [sectorData, setSectorData] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSectorData = async () => {
            try {
                const data = await api.getAnalyticsSectors();
                setSectorData(data);
            } catch (error) {
                console.error('Error fetching sector data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSectorData();
    }, []);

    if (loading) {
        return <div className="text-slate-400">Loading sector data...</div>;
    }

    const chartData = Object.entries(sectorData).map(([name, value]) => ({
        name,
        value
    })).sort((a: any, b: any) => b.value - a.value);

    if (chartData.length === 0) {
        return <div className="text-slate-400">No sector data available</div>;
    }

    const topSector = chartData[0] as any;
    const totalRevenue = chartData.reduce((sum: number, item: any) => sum + item.value, 0);
    const topSectorPercentage = totalRevenue > 0 ? ((topSector.value / totalRevenue) * 100).toFixed(1) : 0;

    return (
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-200">Revenue by Sector</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry: any, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#64748b'} stroke="rgba(0,0,0,0.2)" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                                formatter={(value: number) => `$${value.toFixed(2)}`}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Insight Badge */}
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-200">
                        <span className="font-bold text-blue-100">{topSector.name}</span> is your highest performing sector with <span className="font-bold text-blue-100">${topSector.value.toFixed(2)}</span> revenue ({topSectorPercentage}% of total).
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default SectorPerformanceChart;
