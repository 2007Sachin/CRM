import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Activity } from 'lucide-react';

const SystemPulse = () => {
    const [data, setData] = useState<{ time: string; latency: number }[]>([]);
    const [isUnstable, setIsUnstable] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const latency = Math.floor(Math.random() * (900 - 100 + 1)) + 100;

            setData(prev => {
                const newData = [...prev, { time: timeStr, latency }];
                if (newData.length > 20) newData.shift(); // Keep last 20 points
                return newData;
            });

            setIsUnstable(latency > 500);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const color = isUnstable ? "#f43f5e" : "#10b981"; // Rose Red or Emerald Green

    return (
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Pulse (Latency)</CardTitle>
                <Activity className={`h-4 w-4 ${isUnstable ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {data.length > 0 ? `${data[data.length - 1].latency}ms` : '---'}
                </div>
                <div className="h-[200px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={[0, 1000]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                                itemStyle={{ color: color }}
                            />
                            <Area
                                type="monotone"
                                dataKey="latency"
                                stroke={color}
                                fillOpacity={1}
                                fill="url(#colorLatency)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default SystemPulse;
