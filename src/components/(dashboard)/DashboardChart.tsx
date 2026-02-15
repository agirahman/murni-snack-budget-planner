"use client";

import { Card } from "@/components/ui/Card";
import { TrendingUp, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import dynamic from "next/dynamic";

const ChartArea = dynamic(() => import("@/components/ui/ChartArea").then((mod) => mod.ChartArea), {
    loading: () => <Skeleton className="h-75 w-full rounded-xl" />,
    ssr: false,
});

interface DashboardChartProps {
    chartData: any[];
    topCategories: { name: string; amount: number }[];
    totalExpense: number;
    formatRupiah: (num: number) => string;
    getCategoryStyles: (category: string) => any;
}

export function DashboardChart({ chartData, topCategories, totalExpense, formatRupiah, getCategoryStyles }: DashboardChartProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <Card className="lg:col-span-2 p-6 border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Arus Kas (Net)</h3>
                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                        <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                <div className="h-75 w-full">
                    <ChartArea
                        data={chartData}
                        dataKeyX="date"
                        dataKeyY="amount"
                        color="#3b82f6"
                        height={300}
                    />
                </div>
            </Card>

            {/* Top Categories Section */}
            <Card className="p-6 border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Top Pengeluaran</h3>
                    <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                        <PieChart size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
                <div className="space-y-5">
                    {topCategories.length > 0 ? topCategories.map((cat) => {
                        const styles = getCategoryStyles(cat.name);
                        const Icon = styles.icon;
                        const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;

                        return (
                            <div key={cat.name} className="space-y-2">
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${styles.bg}`}>
                                            <Icon size={16} className={styles.color} />
                                        </div>
                                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{cat.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-neutral-900 dark:text-white">{formatRupiah(cat.amount)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full opacity-80 rounded-full transition-all duration-1000 ${styles.color.replace('text-', 'bg-')}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="h-full flex flex-col items-center justify-center py-8 text-neutral-400">
                            <PieChart size={32} className="mb-2 opacity-20" />
                            <p className="text-xs">Belum ada data pengeluaran</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
