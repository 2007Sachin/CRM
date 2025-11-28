import { useState, useEffect } from 'react';
import { X, Smile, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface UserDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user: any | null;
}

const UserDrawer = ({ isOpen, onClose, user }: UserDrawerProps) => {
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && isOpen) {
            setLoading(true);
            axios.get(`/api/user-history/${user.id}`)
                .then(res => setHistoryData(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user, isOpen]);

    if (!user) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-[600px] bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out p-6 overflow-y-auto",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold">User 360° View</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.company_name}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                                {user.plan_tier}
                            </span>
                            {user.is_whale && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium border border-amber-500/20">
                                    Whale
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* The Correlation Chart */}
                <div className="mb-8">
                    <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        Latency vs. Usage Correlation
                    </h4>
                    <div className="h-[300px] w-full bg-card/50 rounded-lg border border-border p-4">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">Loading history...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={historyData}>
                                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" hide />
                                    <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" label={{ value: 'Calls', angle: -90, position: 'insideLeft', fill: '#3b82f6' }} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" label={{ value: 'Latency (ms)', angle: 90, position: 'insideRight', fill: '#f43f5e' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="calls" name="Call Volume" fill="#3b82f6" barSize={20} radius={[4, 4, 0, 0]} />
                                    <Line yAxisId="right" type="monotone" dataKey="latency" name="Avg Latency" stroke="#f43f5e" strokeWidth={2} dot={false} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        Insight: High latency spikes (Red Line) often precede drops in call volume (Blue Bars).
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        <Smile className="mr-2 h-4 w-4" />
                        Send Satisfaction Survey
                    </Button>
                    <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Report Technical Issue
                    </Button>
                </div>

            </div>
        </>
    );
};

export default UserDrawer;
