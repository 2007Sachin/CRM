import { AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface UserCardProps {
    user: any;
    type: 'risk' | 'new' | 'top';
    onClick: (user: any) => void;
}

const UserCard = ({ user, type, onClick }: UserCardProps) => {
    return (
        <Card
            onClick={() => onClick(user)}
            className={cn(
                "cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] border-l-4",
                type === 'risk' && "border-l-red-500 hover:shadow-red-500/10",
                type === 'new' && "border-l-blue-500 hover:shadow-blue-500/10",
                type === 'top' && "border-l-amber-500 hover:shadow-amber-500/10 border-amber-500/50"
            )}
        >
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-sm">{user.name}</h4>
                        <p className="text-xs text-muted-foreground">{user.company_name}</p>
                    </div>
                    {type === 'risk' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    {type === 'new' && <Clock className="h-4 w-4 text-blue-500" />}
                    {type === 'top' && <TrendingUp className="h-4 w-4 text-amber-500" />}
                </div>

                {/* Dynamic Content based on Type */}
                <div className="mt-3">
                    {type === 'risk' && (
                        <div className="bg-red-500/10 text-red-400 text-xs p-2 rounded border border-red-500/20">
                            <span className="font-bold">Risk:</span> {user.risk_reason}
                        </div>
                    )}

                    {type === 'new' && (
                        <div className={cn(
                            "flex items-center gap-2 text-xs p-2 rounded border",
                            user.activated
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        )}>
                            {user.activated ? (
                                <>
                                    <CheckCircle className="h-3 w-3" /> Activated
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="h-3 w-3" /> Stuck at Setup
                                </>
                            )}
                        </div>
                    )}

                    {type === 'top' && (
                        <div className="bg-amber-500/10 text-amber-400 text-xs p-2 rounded border border-amber-500/20 flex justify-between items-center">
                            <span>Potential ARR</span>
                            <span className="font-mono font-bold">${user.potential_arr?.toFixed(0)}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-2 bg-muted/30 flex justify-end">
                {type === 'risk' && (
                    <Button size="sm" variant="destructive" className="h-7 text-xs w-full">Save User</Button>
                )}
                {type === 'new' && (
                    <Button size="sm" variant="secondary" className="h-7 text-xs w-full">View Onboarding</Button>
                )}
                {type === 'top' && (
                    <Button size="sm" className="h-7 text-xs w-full bg-amber-600 hover:bg-amber-700 text-white">
                        <DollarSign className="h-3 w-3 mr-1" /> Upgrade Offer
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default UserCard;
