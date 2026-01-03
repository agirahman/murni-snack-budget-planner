"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartAreaProps {
    data: any[];
    dataKeyX: string; // Key untuk sumbu X (misal: "date")
    dataKeyY: string; // Key untuk sumbu Y (misal: "amount")
    color?: string;
    height?: number;
}

export const ChartArea = ({
    data,
    dataKeyX,
    dataKeyY,
    color = "#3b82f6", // Default Blue-500
    height = 300,
}: ChartAreaProps) => {
    return (
        <div style={{ width: "100%", height }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey={dataKeyX}
                        stroke="#666"
                        tick={{ fill: "#888", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#666"
                        tick={{ fill: "#888", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#171717",
                            border: "1px solid #333",
                            borderRadius: "12px",
                            color: "#fff",
                        }}
                        itemStyle={{ color: "#fff" }}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKeyY}
                        stroke={color}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill={`url(#gradient-${color})`}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
