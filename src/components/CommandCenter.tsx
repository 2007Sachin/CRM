import { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import UserDrawer from './UserDrawer';
import { Loader2 } from 'lucide-react';

const CommandCenter = () => {
    const [data, setData] = useState<{
        churn_risk: any[];
        new_arrivals: any[];
        top_performers: any[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/command-center-data')
            .then(res => setData(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8 text-foreground font-sans overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto h-full flex flex-col">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Revenue Command Center
                    </h1>
                    <p className="text-muted-foreground">Real-time User Action Board</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">

                    {/* Column 1: High Priority */}
                    <div className="bg-card/30 rounded-xl border border-border/50 p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-red-400 flex items-center gap-2">
                                ⚠️ High Priority: Churn Risk
                            </h2>
                            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                                {data?.churn_risk.length}
                            </span>
                        </div>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {data?.churn_risk.map(user => (
                                <UserCard key={user.id} user={user} type="risk" onClick={handleUserClick} />
                            ))}
                        </div>
                    </div>

                    {/* Column 2: New Arrivals */}
                    <div className="bg-card/30 rounded-xl border border-border/50 p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-blue-400 flex items-center gap-2">
                                🚀 New Arrivals: Activation
                            </h2>
                            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                                {data?.new_arrivals.length}
                            </span>
                        </div>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {data?.new_arrivals.map(user => (
                                <UserCard key={user.id} user={user} type="new" onClick={handleUserClick} />
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Top Performers */}
                    <div className="bg-card/30 rounded-xl border border-border/50 p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-amber-400 flex items-center gap-2">
                                💎 Top Performers: Expansion
                            </h2>
                            <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full">
                                {data?.top_performers.length}
                            </span>
                        </div>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {data?.top_performers.map(user => (
                                <UserCard key={user.id} user={user} type="top" onClick={handleUserClick} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <UserDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                user={selectedUser}
            />
        </div>
    );
};

export default CommandCenter;
