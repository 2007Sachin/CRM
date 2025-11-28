import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { mockUsers, type MockUser } from '../data/mockData';
import { DollarSign, TrendingUp, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';
import { cn } from "../lib/utils";

const UserTable = ({ title, icon: Icon, users, columns, action, className }: any) => (
    <Card className={cn("h-full border-border/50 bg-card/50 backdrop-blur flex flex-col", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {title}
                <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                    {users.length}
                </span>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 sticky top-0 backdrop-blur-sm">
                    <tr>
                        {columns.map((col: any, i: number) => (
                            <th key={i} className="px-4 py-3 font-medium">{col.header}</th>
                        ))}
                        {action && <th className="px-4 py-3 text-right">Action</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {users.map((user: MockUser) => (
                        <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                            {columns.map((col: any, i: number) => (
                                <td key={i} className="px-4 py-3">
                                    {col.render ? col.render(user) : user[col.key as keyof MockUser]}
                                </td>
                            ))}
                            {action && (
                                <td className="px-4 py-3 text-right">
                                    {action(user)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </CardContent>
    </Card>
);

const UserLists = () => {
    // 1. Top Revenue (Cash Cows)
    const cashCows = mockUsers
        .filter(u => u.plan === 'Premium')
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10); // Show top 10

    // 2. Conversion Opportunities
    const conversionTargets = mockUsers
        .filter(u => u.plan === 'Free' && u.usage_count > 300)
        .sort((a, b) => b.usage_count - a.usage_count);

    // 3. Churn Risk
    const churnRisk = mockUsers
        .filter(u => u.plan === 'Premium' && u.usage_trend === 'Decreasing');

    // 4. Recent Signups (General)
    // Exclude those already in other lists to avoid duplicates if desired, 
    // but for simplicity we'll just take recent signups.
    const recentSignups = mockUsers
        .filter(u => u.plan === 'Free' && u.usage_count <= 300)
        .sort((a, b) => new Date(b.signup_date).getTime() - new Date(a.signup_date).getTime())
        .slice(0, 10);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[800px]">

            {/* Top Left: Cash Cows */}
            <UserTable
                title="💎 Top Revenue (Cash Cows)"
                icon={DollarSign}
                users={cashCows}
                columns={[
                    { header: 'Name', key: 'name', render: (u: MockUser) => <span className="font-medium">{u.name}</span> },
                    { header: 'Revenue', key: 'revenue', render: (u: MockUser) => <span className="text-emerald-400 font-mono">${u.revenue.toLocaleString()}</span> },
                    { header: 'Usage', key: 'usage_count', render: (u: MockUser) => <span className="text-muted-foreground">{u.usage_count} calls</span> },
                ]}
                className="border-l-4 border-l-emerald-500"
            />

            {/* Top Right: Conversion Opportunities */}
            <UserTable
                title="🚀 Conversion Opportunities"
                icon={TrendingUp}
                users={conversionTargets}
                columns={[
                    { header: 'Name', key: 'name', render: (u: MockUser) => <span className="font-medium">{u.name}</span> },
                    { header: 'Usage', key: 'usage_count', render: (u: MockUser) => <span className="font-bold text-blue-400">{u.usage_count}</span> },
                    { header: 'Potential Value', key: 'id', render: (u: MockUser) => <span className="text-muted-foreground font-mono">${(u.usage_count * 0.1).toFixed(0)}/mo</span> },
                ]}
                action={() => (
                    <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700">
                        Upgrade Offer
                    </Button>
                )}
                className="border-l-4 border-l-blue-500"
            />

            {/* Bottom Left: Churn Risk */}
            <UserTable
                title="🚨 Churn Risk (At Risk)"
                icon={AlertTriangle}
                users={churnRisk}
                columns={[
                    { header: 'Name', key: 'name', render: (u: MockUser) => <span className="font-medium">{u.name}</span> },
                    { header: 'Trend', key: 'usage_trend', render: () => <span className="text-red-400 flex items-center gap-1"><ArrowUpRight className="h-3 w-3 rotate-180" /> Dropping</span> },
                    { header: 'Revenue at Risk', key: 'revenue', render: (u: MockUser) => <span className="text-red-400 font-mono font-bold">${u.revenue}</span> },
                ]}
                action={() => (
                    <Button size="sm" variant="destructive" className="h-7 text-xs">
                        Contact
                    </Button>
                )}
                className="border-red-500/50 shadow-red-500/5"
            />

            {/* Bottom Right: Recent Signups */}
            <UserTable
                title="Recent Signups"
                icon={Clock}
                users={recentSignups}
                columns={[
                    { header: 'Name', key: 'name', render: (u: MockUser) => <span className="font-medium">{u.name}</span> },
                    { header: 'Signup Date', key: 'signup_date', render: (u: MockUser) => <span className="text-muted-foreground">{new Date(u.signup_date).toLocaleDateString()}</span> },
                    { header: 'Status', key: 'status', render: (u: MockUser) => <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 text-xs">{u.status}</span> },
                ]}
            />

        </div>
    );
};

export default UserLists;
