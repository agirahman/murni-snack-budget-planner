"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import dynamic from "next/dynamic";

interface Transaction {
    _id: string;
    description: string;
    amount: number;
    type: "pemasukan" | "pengeluaran";
    category: string;
    date: string;
}

const ChartArea = dynamic(() => import("@/components/ui/ChartArea").then((mod) => mod.ChartArea), {
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />,
    ssr: false,
});

const Modal = dynamic(() => import("@/components/ui/Modal").then((mod) => mod.Modal), {
    ssr: false,
});

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<"all" | "pemasukan" | "pengeluaran">("all");

    // Date Filter State
    const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "year" | "custom">("month"); // Default This Month
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

    // Handle Add Transaction
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post("/transactions", formData);
            await fetchData(); // Refresh data
            setIsModalOpen(false);
            // Reset form
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

    // 1. Filter Data by Date (Master Filter)
    const filteredByDate = useMemo(() => {
        if (dateFilter === 'all') return transactions;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return transactions.filter(t => {
            const tDate = new Date(t.date);
            const tTime = tDate.getTime();

            if (dateFilter === 'today') {
                return tTime >= startOfDay.getTime() && tTime < startOfDay.getTime() + 86400000;
            }
            if (dateFilter === 'week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
                startOfWeek.setHours(0, 0, 0, 0);
                return tTime >= startOfWeek.getTime();
            }
            if (dateFilter === 'month') {
                return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
            }
            if (dateFilter === 'year') {
                return tDate.getFullYear() === now.getFullYear();
            }
            if (dateFilter === 'custom') {
                if (!customRange.start || !customRange.end) return true;
                const start = new Date(customRange.start).getTime();
                const end = new Date(customRange.end).getTime() + 86400000; // Include end date
                return tTime >= start && tTime < end;
            }
            return true;
        });
    }, [transactions, dateFilter, customRange]);

    // 2. Calculate Dashboard Summary from Date-Filtered Data
    const summary = useMemo(() => {
        const income = filteredByDate
            .filter(t => t.type === 'pemasukan')
            .reduce((acc, t) => acc + t.amount, 0);

        const expense = filteredByDate
            .filter(t => t.type === 'pengeluaran')
            .reduce((acc, t) => acc + t.amount, 0);

        return { income, expense, total: income - expense };
    }, [filteredByDate]);

    // 3. Prepare Chart Data
    const chartData = useMemo(() => {
        const sorted = [...filteredByDate].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return sorted.map(t => ({
            date: new Date(t.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
            amount: t.type === 'pemasukan' ? t.amount : -t.amount,
            originalAmount: t.amount,
            type: t.type
        }));
    }, [filteredByDate]);

    // 4. Filter List by Type (Newest First)
    const filteredTransactions = useMemo(() => {
        let data = [...filteredByDate];
        if (filterType !== 'all') {
            data = data.filter(t => t.type === filterType);
        }
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return data;
    }, [filteredByDate, filterType]);

    // Format Currency
    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(num);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="space-y-8">
                {/* Header Skeleton */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Skeleton className="h-8 w-64 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Summary Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="border-neutral-800">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Chart Skeleton */}
                <Card className="p-6 border-neutral-800">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </Card>

                {/* List Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="grid gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard Keuangan</h1>
                        <p className="text-neutral-400">Ringkasan performa toko Anda</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500">
                        <Plus className="mr-2 h-4 w-4" />
                        Transaksi Baru
                    </Button>
                </div>

                {/* Date Filters */}
                <div className="flex flex-wrap items-center gap-2 bg-neutral-900/50 p-1.5 rounded-xl border border-neutral-800 w-fit">
                    {(['today', 'week', 'month', 'year', 'all', 'custom'] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setDateFilter(filter)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${dateFilter === filter
                                ? 'bg-neutral-800 text-white shadow-sm'
                                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
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

                {/* Custom Range Inputs */}
                {dateFilter === 'custom' && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <Input
                            type="date"
                            className="w-auto h-9"
                            value={customRange.start}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className="text-neutral-500">-</span>
                        <Input
                            type="date"
                            className="w-auto h-9"
                            value={customRange.end}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border-blue-500/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400">Total Saldo</p>
                            <h3 className="text-2xl font-bold text-white">{formatRupiah(summary.total)}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border-emerald-500/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                            <ArrowUpCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400">Pemasukan</p>
                            <h3 className="text-2xl font-bold text-emerald-400">{formatRupiah(summary.income)}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-red-900/20 to-red-900/5 border-red-500/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                            <ArrowDownCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400">Pengeluaran</p>
                            <h3 className="text-2xl font-bold text-red-400">{formatRupiah(summary.expense)}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Chart Section */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Grafik Arus Kas (Net)</h3>
                <div className="h-[300px] w-full">
                    <ChartArea
                        data={chartData}
                        dataKeyX="date"
                        dataKeyY="amount"
                        color="#3b82f6"
                        height={300}
                    />
                </div>
            </Card>

            {/* Transactions List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Riwayat Transaksi</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterType("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${filterType === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-400 border-neutral-800 hover:text-white'}`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilterType("pemasukan")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${filterType === 'pemasukan' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-transparent text-neutral-400 border-neutral-800 hover:text-white'}`}
                        >
                            Masuk
                        </button>
                        <button
                            onClick={() => setFilterType("pengeluaran")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${filterType === 'pengeluaran' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-transparent text-neutral-400 border-neutral-800 hover:text-white'}`}
                        >
                            Keluar
                        </button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {filteredTransactions.map((t, i) => (
                        <div
                            key={t._id}
                            className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between hover:border-neutral-700 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${t.type === 'pemasukan' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {t.type === 'pemasukan' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{t.description}</h4>
                                    <p className="text-xs text-neutral-500">{t.category} • {new Date(t.date).toLocaleDateString("id-ID")}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${t.type === 'pemasukan' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {t.type === 'pemasukan' ? '+' : '-'}{formatRupiah(t.amount)}
                            </span>
                        </div>
                    ))}
                    {filteredTransactions.length === 0 && !isLoading && (
                        <p className="text-center text-neutral-500 py-8">Belum ada transaksi</p>
                    )}
                </div>
            </div>

            {/* Add Transaction Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tambah Transaksi Baru"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Jenis Transaksi</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: "pemasukan" })}
                                className={`p-2 rounded-lg text-sm transition-colors ${formData.type === "pemasukan" ? "bg-emerald-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
                            >
                                Pemasukan
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: "pengeluaran" })}
                                className={`p-2 rounded-lg text-sm transition-colors ${formData.type === "pengeluaran" ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
                            >
                                Pengeluaran
                            </button>
                        </div>
                    </div>

                    <Input
                        label="Deskripsi"
                        placeholder="Contoh: Penjualan Harian"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />

                    <Input
                        label="Jumlah (Rp)"
                        type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                    />

                    <Input
                        label="Kategori"
                        placeholder="Contoh: Makanan, Stok, Gaji"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                    />

                    <Input
                        label="Tanggal"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />

                    <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
                        Simpan Transaksi
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
