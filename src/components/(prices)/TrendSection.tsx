"use client";

import { Card } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";
import { PriceTrendChart } from "@/components/ui/PriceTrendChart";

interface TrendSectionProps {
    data: any[];
}

export function TrendSection({ data }: TrendSectionProps) {
    return (
        <Card className="p-6 border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                        <BarChart3 size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Tren Harga</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Visualisasi perubahan harga dari waktu ke waktu</p>
                    </div>
                </div>
            </div>
            <PriceTrendChart data={data} height={200} />
        </Card>
    );
}
