"use client";

import { ShoppingBag, Users, Settings, TrendingUp, Utensils, MoreHorizontal } from "lucide-react";

interface Transaction {
    _id: string;
    description: string;
    amount: number;
    type: "pemasukan" | "pengeluaran";
    category: string;
    date: string;
}

interface TransactionListProps {
    transactions: Transaction[];
    filterType: "all" | "pemasukan" | "pengeluaran";
    setFilterType: (type: "all" | "pemasukan" | "pengeluaran") => void;
    getCategoryStyles: (category: string) => any;
    formatRupiah: (num: number) => string;
}

export function TransactionList({ transactions, filterType, setFilterType, getCategoryStyles, formatRupiah }: TransactionListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Riwayat Transaksi</h3>
                <div className="flex gap-2">
                    {(['all', 'pemasukan', 'pengeluaran'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${filterType === type
                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white'
                                : 'bg-transparent text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                        >
                            {type === 'all' ? 'Semua' : type === 'pemasukan' ? 'Masuk' : 'Keluar'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4">
                {transactions.map((t) => {
                    const styles = getCategoryStyles(t.category);
                    const Icon = styles.icon;
                    return (
                        <div
                            key={t._id}
                            className="p-4 rounded-2xl bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-2xl transition-all duration-300 ${styles.bg}`}>
                                    <Icon size={20} className={styles.color} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-neutral-900 dark:text-white">{t.description}</h4>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.category} • {new Date(t.date).toLocaleDateString("id-ID")}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${t.type === 'pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {t.type === 'pemasukan' ? '+' : '-'}{formatRupiah(t.amount)}
                            </span>
                        </div>
                    );
                })}
                {transactions.length === 0 && (
                    <p className="text-center text-neutral-500 py-8">Belum ada transaksi</p>
                )}
            </div>
        </div>
    );
}
