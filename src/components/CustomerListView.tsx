import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, DollarSign, TrendingUp, AlertTriangle, Users, Filter, ArrowDownWideNarrow } from "lucide-react";
import { type User, api } from '../services/api';
import { cn } from "../lib/utils";

interface CustomerListViewProps {
    category: string;
    onBack: () => void;
    onUserSelect: (user: User) => void;
}

const INDUSTRY_COLORS: Record<string, string> = {
    'BFSI': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Health Tech': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    'Ecommerce': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'EdTech': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Hospitality': 'bg-pink-500/10 text-pink-400 border-pink-500/20'
};

const CustomerListView = ({ category, onBack, onUserSelect }: CustomerListViewProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
    const [sortByMargin, setSortByMargin] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div className="text-slate-400">Loading users...</div>;
    }

    // 1. Base Filter Logic (Category)
    let baseUsers: User[] = [];
    let title = "";
    let Icon = Users;
    let themeColor = "text-slate-100";

    switch (category) {
        case 'CASH_COWS':
            baseUsers = users.filter(u => (u.plan === 'Enterprise' || u.plan === 'Pro') && u.revenue > 1000).sort((a, b) => b.revenue - a.revenue);
            title = "Cash Cows List";
            Icon = DollarSign;
            themeColor = "text-emerald-400";
            break;
        case 'CONVERSION':
            baseUsers = users.filter(u => u.plan === 'Free' && u.usage_count > 300).sort((a, b) => b.usage_count - a.usage_count);
            title = "Conversion Targets";
            Icon = TrendingUp;
            themeColor = "text-blue-400";
            break;
        case 'CHURN':
            baseUsers = users.filter(u => (u.plan === 'Enterprise' || u.plan === 'Pro') && u.usage_trend === 'Decreasing');
            title = "Churn Risk List";
            Icon = AlertTriangle;
            themeColor = "text-red-400";
            break;
        case 'GENERAL':
            baseUsers = users.filter(u => u.plan === 'Free' && u.usage_count <= 300);
            title = "General Pool";
            Icon = Users;
            themeColor = "text-slate-400";
            break;
        default:
            baseUsers = users;
            title = "All Users";
    }

    // 2. Secondary Filter Logic (Industry)
    let filteredUsers = selectedIndustry === 'All'
        ? baseUsers
        : baseUsers.filter(u => u.industry === selectedIndustry);

    // 3. Sort Logic (Margin)
    if (sortByMargin) {
        filteredUsers = [...filteredUsers].sort((a, b) => a.margin_percent - b.margin_percent);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-800 text-slate-400 hover:text-white">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-slate-800/50", themeColor)}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
                            <p className="text-sm text-slate-400">{filteredUsers.length} users found</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Sorts */}
                <div className="flex items-center gap-3">
                    {/*Sort by Margin Toggle */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortByMargin(!sortByMargin)}
                        className={cn(
                            "border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800",
                            sortByMargin && "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300"
                        )}
                    >
                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                        {sortByMargin ? "Lowest Margin First" : "Sort by Margin"}
                    </Button>

                    {/* Vertical Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <select
                            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                        >
                            <option value="All">All Verticals</option>
                            <option value="BFSI">BFSI</option>
                            <option value="Health Tech">Health Tech</option>
                            <option value="Ecommerce">Ecommerce</option>
                            <option value="EdTech">EdTech</option>
                            <option value="Hospitality">Hospitality</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Vertical</th>
                                    <th className="px-6 py-4 font-medium">Plan</th>
                                    <th className="px-6 py-4 font-medium">Usage</th>
                                    <th className="px-6 py-4 font-medium text-right">Margin %</th>
                                    <th className="px-6 py-4 font-medium text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        onClick={() => onUserSelect(user)}
                                        className="hover:bg-muted/10 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-white">
                                            <div>{user.name}</div>
                                            <div className="text-xs text-slate-500 font-normal">{user.company}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                                                INDUSTRY_COLORS[user.industry] || "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                            )}>
                                                {user.industry}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                (user.plan === 'Enterprise' || user.plan === 'Pro')
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                            )}>
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-300">
                                            {user.usage_count}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-medium">
                                            <span className={cn(
                                                user.margin_percent < 20 ? "text-red-400 font-bold" : "text-slate-300"
                                            )}>
                                                {user.margin_percent}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-200">
                                            ${user.revenue.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerListView;
