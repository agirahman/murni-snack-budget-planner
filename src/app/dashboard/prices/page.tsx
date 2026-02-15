"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { PriceTrendChart } from "@/components/ui/PriceTrendChart";
import { Combobox } from "@/components/ui/Combobox";
import { Plus, TrendingUp, TrendingDown, Minus, Calendar, BarChart3, Info, Search } from "lucide-react";

interface Product {
    _id: string;
    nama_produk: string;
    satuan_default: "kg" | "dus";
}

interface PriceHistory {
    _id: string;
    product_id: Product;
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

export default function PricesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    const [products, setProducts] = useState<Product[]>([]);
    const [prices, setPrices] = useState<PriceHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [formData, setFormData] = useState({
        product_id: "",
        harga: "",
        satuan: "kg" as "kg" | "dus",
        tanggal: new Date().toISOString().split("T")[0]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchProducts();
            fetchPrices();
        }
    }, [user]);

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchPrices = async () => {
        try {
            setLoading(true);
            const response = await api.get("/prices");
            setPrices(response.data.data);
        } catch (error) {
            console.error("Error fetching prices:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductChange = (productId: string) => {
        const product = products.find(p => p._id === productId);
        setFormData({
            ...formData,
            product_id: productId,
            satuan: product?.satuan_default || "kg"
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await api.post("/prices", {
                ...formData,
                harga: Number(formData.harga)
            });
            showToast("Harga berhasil dicatat", "success");
            setIsModalOpen(false);
            setFormData({
                product_id: "",
                harga: "",
                satuan: "kg",
                tanggal: new Date().toISOString().split("T")[0]
            });
            fetchPrices();
        } catch (error) {
            console.error("Error saving price:", error);
            showToast("Gagal menyimpan harga", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(amount);
    };

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

    // Filter prices by selected product
    const filteredPrices = selectedProductId
        ? prices.filter(p => p.product_id._id === selectedProductId)
        : prices;

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="container mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Riwayat Harga</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Catat dan bandingkan harga produk</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Catat Harga Baru
                    </Button>
                </div>

                {/* Trend Analysis Section - Only visible when a product is selected */}
                {selectedProductId && filteredPrices.length > 1 && (
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
                        <PriceTrendChart data={filteredPrices} height={200} />
                    </Card>
                )}

                {/* Sticky Filter Container */}
                <div className="sticky top-16 z-20 -mx-4 px-4 py-4 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-transparent transition-all duration-200">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3 items-end">
                            <div className="flex-1 w-full">
                                <Combobox
                                    label="Filter Produk"
                                    placeholder="Cari & Pilih Produk..."
                                    searchPlaceholder="Ketik nama produk..."
                                    options={products.map(p => ({
                                        id: p._id,
                                        label: p.nama_produk,
                                        metadata: `${prices.filter(pr => pr.product_id._id === p._id).length} data`
                                    }))}
                                    value={selectedProductId}
                                    onChange={(val) => setSelectedProductId(val)}
                                />
                            </div>
                            {selectedProductId && (
                                <button
                                    onClick={() => setSelectedProductId("")}
                                    className="h-11 px-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-sm font-medium whitespace-nowrap shadow-sm"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Price History List */}
                <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-sm relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    {loading ? (
                        <div className="p-8 text-center text-neutral-500">Memuat data...</div>
                    ) : filteredPrices.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500">
                            Belum ada riwayat harga. Mulai catat harga!
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {filteredPrices.map((price) => (
                                <div key={price._id} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                        {/* Left: Product Info */}
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

                                        {/* Right: Price, Comparison, Previous Price */}
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

                {/* Add Price Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Catat Harga Baru"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Product Select */}
                        <Combobox
                            label="Pilih Produk"
                            placeholder="Cari & Pilih Produk..."
                            options={products.map(p => ({
                                id: p._id,
                                label: p.nama_produk,
                                metadata: p.satuan_default.toUpperCase()
                            }))}
                            value={formData.product_id}
                            onChange={(val) => handleProductChange(val)}
                        />

                        {/* Price Input */}
                        <Input
                            label="Harga"
                            type="number"
                            value={formData.harga}
                            onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                            placeholder="Contoh: 15000"
                            required
                        />

                        {/* Unit Select */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Satuan
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, satuan: "kg" })}
                                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${formData.satuan === "kg"
                                        ? "bg-blue-600 text-white"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
                                >
                                    KG
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, satuan: "dus" })}
                                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${formData.satuan === "dus"
                                        ? "bg-blue-600 text-white"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
                                >
                                    DUS
                                </button>
                            </div>
                        </div>

                        {/* Date Input */}
                        <Input
                            label="Tanggal"
                            type="date"
                            value={formData.tanggal}
                            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-2"
                            isLoading={isSubmitting}
                        >
                            Simpan Harga
                        </Button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}
