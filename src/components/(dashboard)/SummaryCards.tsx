"use client";

import { Card } from "@/components/ui/Card";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Eye, EyeOff } from "lucide-react";

interface SummaryCardsProps {
    total: number;
    income: number;
    expense: number;
    showBalance: boolean;
    onToggleBalance: () => void;
    formatRupiah: (num: number) => string;
}

export function SummaryCards({ total, income, expense, showBalance, onToggleBalance, formatRupiah }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/5 border-blue-200 dark:border-blue-500/20 relative">
                <button
                    onClick={onToggleBalance}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-blue-600 dark:text-blue-400 transition-colors"
                >
                    {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Saldo</p>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {showBalance ? formatRupiah(total) : "Rp •••••••"}
                        </h3>
                    </div>
                </div>
            </Card>

            <Card className="bg-linear-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/5 border-emerald-200 dark:border-emerald-500/20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <ArrowUpCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Pemasukan</p>
                        <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {showBalance ? formatRupiah(income) : "Rp •••••••"}
                        </h3>
                    </div>
                </div>
            </Card>

            <Card className="bg-linear-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/5 border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-xl text-red-600 dark:text-red-400">
                        <ArrowDownCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Pengeluaran</p>
                        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {showBalance ? formatRupiah(expense) : "Rp •••••••"}
                        </h3>
                    </div>
                </div>
            </Card>
        </div>
    );
}
