"use client";

import { Card } from "@/components/ui/Card";
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PriceHistory {
    _id: string;
    product_id: { nama_produk: string };
    harga: number;
    satuan: string;
    tanggal: string;
    comparison: {
        selisih: number;
        persentase: number;
        status: "naik" | "turun" | "stabil";
        harga_sebelumnya: number;
    } | null;
}

interface PriceListProps {
    prices: PriceHistory[];
    loading: boolean;
    formatRupiah: (num: number) => string;
}

export function PriceList({ prices, loading, formatRupiah }: PriceListProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "naik":
                return <TrendingUp className="text-red-500" size={18} />;
            case "turun":
                return <TrendingDown className="text-emerald-500" size={18} />;
            default:
                return <Minus className="text-neutral-400" size={18} />;
        }
    };

    const getStatusBadge = (comparison: PriceHistory["comparison"]) => {
        if (!comparison) return null;

        const statusColors = {
            naik: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
            turun: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
            stabil: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
        };

        return (
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusColors[comparison.status]}`}>
                {getStatusIcon(comparison.status)}
                <span>{comparison.status === "naik" ? "+" : ""}{comparison.persentase}%</span>
                <span className="text-neutral-400">({comparison.status === "naik" ? "+" : ""}{formatRupiah(comparison.selisih)})</span>
            </div>
        );
    };

    return (
        <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-sm relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            {loading ? (
                <div className="p-8 text-center text-neutral-500">Memuat data...</div>
            ) : prices.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                    Belum ada riwayat harga. Mulai catat harga!
                </div>
            ) : (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {prices.map((price) => (
                        <div key={price._id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
                                        {price.product_id.nama_produk}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(price.tanggal).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </span>
                                        <span>per {price.satuan.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                                    <p className="text-xl font-bold text-neutral-900 dark:text-white">
                                        {formatRupiah(price.harga)}
                                    </p>
                                    {getStatusBadge(price.comparison)}
                                    {price.comparison && (
                                        <span className="text-xs text-neutral-400 whitespace-nowrap">
                                            (sblm: {formatRupiah(price.comparison.harga_sebelumnya)})
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
