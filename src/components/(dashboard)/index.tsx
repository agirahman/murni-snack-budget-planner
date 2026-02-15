"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, ShoppingBag, Users, Settings, TrendingUp, Utensils, MoreHorizontal } from "lucide-react";
import { DashboardSkeleton } from "./Skeleton";
import { SummaryCards } from "./SummaryCards";
import { DashboardChart } from "./DashboardChart";
import { TransactionList } from "./TransactionList";
import { TransactionModal } from "./TransactionModal";

interface Transaction {
    _id: string;
    description: string;
    amount: number;
    type: "pemasukan" | "pengeluaran";
    category: string;
    date: string;
}

export default function DashboardComponent() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<"all" | "pemasukan" | "pengeluaran">("all");
    const [showBalance, setShowBalance] = useState(true);

    // Date Filter State
    const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "year" | "custom">("month");
    const [customRange, setCustomRange] = useState({ start: "", end: "" });

    // Form State
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        type: "pemasukan",
        category: "",
        date: new Date().toISOString().split('T')[0]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/transactions");
            setTransactions(res.data.data);
        } catch (error) {
            console.error("Gagal mengambil data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post("/transactions", formData);
            await fetchData();
            setIsModalOpen(false);
            setFormData({
                description: "",
                amount: "",
                type: "pemasukan",
                category: "",
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Gagal menambah transaksi", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredByDate = useMemo(() => {
        if (dateFilter === 'all') return transactions;
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return transactions.filter(t => {
            const tDate = new Date(t.date);
            const tTime = tDate.getTime();

            if (dateFilter === 'today') return tTime >= startOfDay.getTime() && tTime < startOfDay.getTime() + 86400000;
            if (dateFilter === 'week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                return tTime >= startOfWeek.getTime();
            }
            if (dateFilter === 'month') return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
            if (dateFilter === 'year') return tDate.getFullYear() === now.getFullYear();
            if (dateFilter === 'custom') {
                if (!customRange.start || !customRange.end) return true;
                const start = new Date(customRange.start).getTime();
                const end = new Date(customRange.end).getTime() + 86400000;
                return tTime >= start && tTime < end;
            }
            return true;
        });
    }, [transactions, dateFilter, customRange]);

    const summary = useMemo(() => {
        const income = filteredByDate.filter(t => t.type === 'pemasukan').reduce((acc, t) => acc + t.amount, 0);
        const expense = filteredByDate.filter(t => t.type === 'pengeluaran').reduce((acc, t) => acc + t.amount, 0);
        return { income, expense, total: income - expense };
    }, [filteredByDate]);

    const chartData = useMemo(() => {
        const sorted = [...filteredByDate].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sorted.map(t => ({
            date: new Date(t.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
            amount: t.type === 'pemasukan' ? t.amount : -t.amount,
            originalAmount: t.amount,
            type: t.type
        }));
    }, [filteredByDate]);

    const filteredTransactions = useMemo(() => {
        let data = [...filteredByDate];
        if (filterType !== 'all') data = data.filter(t => t.type === filterType);
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return data;
    }, [filteredByDate, filterType]);

    const categoryConfig: Record<string, { icon: any, color: string, bg: string }> = {
        "Stok": { icon: ShoppingBag, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10" },
        "Gaji": { icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-500/10" },
        "Operasional": { icon: Settings, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
        "Penjualan": { icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
        "Makan": { icon: Utensils, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-500/10" },
        "default": { icon: MoreHorizontal, color: "text-neutral-600 dark:text-neutral-400", bg: "bg-neutral-100 dark:bg-neutral-800" }
    };

    const getCategoryStyles = (category: string) => {
        const key = Object.keys(categoryConfig).find(k => category.toLowerCase().includes(k.toLowerCase())) || "default";
        return categoryConfig[key];
    };

    const topCategories = useMemo(() => {
        const catMap: Record<string, number> = {};
        filteredByDate.forEach(t => {
            if (t.type === 'pengeluaran') catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        });
        return Object.entries(catMap).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount).slice(0, 4);
    }, [filteredByDate]);

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard Keuangan</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Ringkasan performa toko Anda</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Transaksi Baru
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-neutral-900 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 w-fit shadow-sm">
                    {(['today', 'week', 'month', 'year', 'all', 'custom'] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setDateFilter(filter)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${dateFilter === filter
                                ? 'bg-neutral-900 dark:bg-neutral-800 text-white shadow-sm'
                                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                }`}
                        >
                            {filter === 'today' && 'Hari Ini'}
                            {filter === 'week' && 'Minggu Ini'}
                            {filter === 'month' && 'Bulan Ini'}
                            {filter === 'year' && 'Tahun Ini'}
                            {filter === 'all' && 'Semua'}
                            {filter === 'custom' && 'Custom'}
                        </button>
                    ))}
                </div>

                {dateFilter === 'custom' && (
                    <div className="flex items-center animate-in fade-in slide-in-from-top-2">
                        <Input
                            type="date"
                            className="w-auto h-9"
                            value={customRange.start}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <Input
                            type="date"
                            className="w-auto h-9"
                            value={customRange.end}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                )}
            </div>

            <SummaryCards
                total={summary.total}
                income={summary.income}
                expense={summary.expense}
                showBalance={showBalance}
                onToggleBalance={() => setShowBalance(!showBalance)}
                formatRupiah={formatRupiah}
            />

            <DashboardChart
                chartData={chartData}
                topCategories={topCategories}
                totalExpense={summary.expense}
                formatRupiah={formatRupiah}
                getCategoryStyles={getCategoryStyles}
            />

            <TransactionList
                transactions={filteredTransactions}
                filterType={filterType}
                setFilterType={setFilterType}
                getCategoryStyles={getCategoryStyles}
                formatRupiah={formatRupiah}
            />

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
