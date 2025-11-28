import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, DollarSign, Activity, Clock, Mail, RefreshCw, CreditCard, ShieldCheck, Server, Zap, Lightbulb } from "lucide-react";
import { type MockUser } from '../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "../lib/utils";

interface CustomerDetailDashboardProps {
    user: MockUser;
    onBack: () => void;
}

// Helper to generate fake history
const generateHistory = () => {
    const data = [];
    for (let i = 30; i > 0; i--) {
        data.push({
            day: `Day ${31 - i}`,
            usage: Math.floor(Math.random() * 100) + 20,
            latency: Math.floor(Math.random() * 300) + 100,
        });
    }
    return data;
};

const CustomerDetailDashboard = ({ user, onBack }: CustomerDetailDashboardProps) => {
    const historyData = generateHistory();

    // Unit Economics Logic
    const isHighCost = user.cost_per_min > 0.10;
    const potentialSavings = isHighCost ? (user.cost_per_min - 0.06).toFixed(3) : 0; // Assuming 0.06 is optimal

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* 1. Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-800 text-slate-400 hover:text-white">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                            {user.name}
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                                user.status === 'Active'
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                            )}>
                                {user.status}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg">{user.company}</p>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-sm text-slate-400">Customer ID</div>
                    <div className="font-mono text-slate-200">{user.id}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Main Content Area (Left 3 Cols) */}
                <div className="lg:col-span-3 space-y-6">

                    {/* 2. Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Lifetime Value</p>
                                    <p className="text-2xl font-bold text-slate-100">${(user.revenue * 12).toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Avg Latency</p>
                                    <p className="text-2xl font-bold text-slate-100">142ms</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Last Active</p>
                                    <p className="text-2xl font-bold text-slate-100">2h ago</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 3. Infrastructure & Unit Economics (NEW) */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <Server className="h-5 w-5 text-indigo-400" />
                                Infrastructure & Unit Economics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Stack Badges */}
                            <div className="flex flex-wrap gap-2">
                                {user.stack_config && Object.entries(user.stack_config).map(([key, value]) => (
                                    <div key={key} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-2">
                                        <span className="uppercase text-slate-500 font-bold">{key}:</span>
                                        <span className="text-indigo-300">{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Profitometer */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-emerald-400">Revenue: ${user.price_per_min}/min</span>
                                    <span className="text-red-400">Cost: ${user.cost_per_min}/min</span>
                                </div>
                                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                                    {/* Cost Bar */}
                                    <div
                                        className="h-full bg-red-500/50"
                                        style={{ width: `${(user.cost_per_min / user.price_per_min) * 100}%` }}
                                    />
                                    {/* Margin Bar */}
                                    <div className="h-full bg-emerald-500/50 flex-1" />
                                </div>
                                <div className="text-right text-xs font-bold text-blue-400">
                                    Net Margin: {user.margin_percent}%
                                </div>
                            </div>

                            {/* Optimization Engine */}
                            {isHighCost && (
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start gap-3">
                                    <Lightbulb className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-indigo-200">Savings Opportunity Detected</h4>
                                        <p className="text-xs text-indigo-300/80 mt-1">
                                            Switching to <span className="font-mono font-bold text-white">Deepgram + Plivo</span> could save this client <span className="font-bold text-white">${potentialSavings}/min</span> while maintaining quality.
                                        </p>
                                        <Button size="sm" className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white border-0 h-7 text-xs">
                                            <Zap className="h-3 w-3 mr-1" /> Generate Proposal
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 4. Deep-Dive Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Chart A: Usage History */}
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-slate-300">30-Day Usage History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={historyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                            <XAxis dataKey="day" hide />
                                            <YAxis stroke="#94a3b8" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                                                cursor={{ fill: '#1e293b' }}
                                            />
                                            <Bar dataKey="usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Chart B: Latency Correlation */}
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-slate-300">Latency Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={historyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                            <XAxis dataKey="day" hide />
                                            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 500]} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                                            />
                                            <Line type="monotone" dataKey="latency" stroke="#f43f5e" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 5. Action Panel (Right Side) */}
                <div className="space-y-4">
                    <Card className="bg-slate-900/50 border-slate-800 h-full">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-100">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start" variant="outline">
                                <RefreshCw className="mr-2 h-4 w-4" /> Reset API Key
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <Mail className="mr-2 h-4 w-4" /> Send Email
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <ShieldCheck className="mr-2 h-4 w-4" /> Extend Trial
                            </Button>
                            <div className="h-px bg-slate-800 my-4" />
                            <Button className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20" variant="outline">
                                <CreditCard className="mr-2 h-4 w-4" /> Issue Refund
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default CustomerDetailDashboard;
