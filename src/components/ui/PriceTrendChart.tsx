"use client";

import { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface PriceTrendChartProps {
    data: any[];
    height?: number;
}

export function PriceTrendChart({ data, height = 300 }: PriceTrendChartProps) {
    const chartData = useMemo(() => {
        return [...data]
            .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
            .map(item => ({
                date: new Date(item.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
                fullDate: new Date(item.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
                price: item.harga,
            }));
    }, [data]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (data.length === 0) return null;

    return (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.1} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888888', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        hide
                        domain={['dataMin - 1000', 'dataMax + 1000']}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl shadow-xl">
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{payload[0].payload.fullDate}</p>
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                                            {formatCurrency(payload[0].value as number)}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
