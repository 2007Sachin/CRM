import { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Users, Loader2 } from 'lucide-react';
import { cn } from "../lib/utils";
import MixpanelFunnel from './MixpanelFunnel';
import SectorPerformanceChart from './SectorPerformanceChart';
import { api } from '../services/api';

interface DashboardHomeProps {
    onCategorySelect: (category: string) => void;
    onUserSelect: (user: any) => void;
}

const ActionTile = ({ title, count, subtext, icon: Icon, gradient, onClick }: any) => (
    <Card
        onClick={onClick}
        className={cn(
            "cursor-pointer transition-all duration-300 hover:scale-[1.02] border-0 relative overflow-hidden group",
            gradient
        )}
    >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                    <h3 className="text-4xl font-bold text-white mb-1">{count}</h3>
                    <p className="text-white/80 font-medium text-sm uppercase tracking-wider">{title}</p>
                </div>
            </div>
            <div className="mt-8">
                <p className="text-white/60 text-sm font-medium border-t border-white/10 pt-4">
                    {subtext}
                </p>
            </div>
        </CardContent>
    </Card>
);

const DashboardHome = ({ onCategorySelect }: DashboardHomeProps) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const users = await api.getUsers();

                const cashCows = users.filter(u => (u.plan === 'Enterprise' || u.plan === 'Pro') && u.revenue > 1000);
                const conversionTargets = users.filter(u => u.plan === 'Free' && u.usage_count > 300);
                const churnRisk = users.filter(u => (u.plan === 'Enterprise' || u.plan === 'Pro') && u.usage_trend === 'Decreasing');
                const generalPool = users.filter(u => u.plan === 'Free' && u.usage_count <= 300);

                const cashCowsRevenue = cashCows.reduce((sum, u) => sum + u.revenue, 0);

                setStats({
                    cashCows: cashCows.length,
                    cashCowsRevenue,
                    conversionTargets: conversionTargets.length,
                    churnRisk: churnRisk.length,
                    generalPool: generalPool.length
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                // Set default values on error
                setStats({
                    cashCows: 0,
                    cashCowsRevenue: 0,
                    conversionTargets: 0,
                    churnRisk: 0,
                    generalPool: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        BolnaOS Revenue Command Center
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm md:text-base">
                        Real-time analytics and user segmentation for revenue optimization.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-400">Live Data</span>
                </div>
            </header>

            {/* Top Section: Funnel Analysis & Sector Performance */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <MixpanelFunnel />
                </div>
                <div className="lg:col-span-1">
                    <SectorPerformanceChart />
                </div>
            </section>

            {/* Bottom Section: Action Tiles Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Cash Cows */}
                <ActionTile
                    title="Cash Cows"
                    count={`${stats?.cashCows || 0} Users`}
                    subtext={`Total Rev: $${((stats?.cashCowsRevenue || 0) / 1000).toFixed(0)}k`}
                    icon={DollarSign}
                    gradient="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
                    onClick={() => onCategorySelect('CASH_COWS')}
                />

                {/* 2. Conversion Targets */}
                <ActionTile
                    title="Conversion Targets"
                    count={`${stats?.conversionTargets || 0} Users`}
                    subtext="High Usage / Free Plan"
                    icon={TrendingUp}
                    gradient="bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/20"
                    onClick={() => onCategorySelect('CONVERSION')}
                />

                {/* 3. Churn Risk */}
                <ActionTile
                    title="Churn Risk"
                    count={`${stats?.churnRisk || 0} Users`}
                    subtext="Usage Dropped 40%"
                    icon={AlertTriangle}
                    gradient="bg-gradient-to-br from-red-900/80 to-rose-900/80 border border-red-500/30"
                    onClick={() => onCategorySelect('CHURN')}
                />

                {/* 4. General Pool */}
                <ActionTile
                    title="General Pool"
                    count={`${stats?.generalPool || 0} Users`}
                    subtext="New Signups"
                    icon={Users}
                    gradient="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600"
                    onClick={() => onCategorySelect('GENERAL')}
                />

            </section>
        </div>
    );
};

export default DashboardHome;
