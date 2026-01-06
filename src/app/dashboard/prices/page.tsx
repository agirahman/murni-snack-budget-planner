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
import { Plus, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";

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

                {/* Filter by Product */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Filter Produk
                        </label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="w-full h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 px-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <option value="">Semua Produk ({prices.length} data)</option>
                            {products.map((product) => {
                                const count = prices.filter(p => p.product_id._id === product._id).length;
                                return (
                                    <option key={product._id} value={product._id}>
                                        {product.nama_produk} ({count} data)
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    {selectedProductId && (
                        <button
                            onClick={() => setSelectedProductId("")}
                            className="self-end h-11 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                {/* Price History List */}
                <Card className="overflow-hidden">
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
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Pilih Produk
                            </label>
                            <select
                                value={formData.product_id}
                                onChange={(e) => handleProductChange(e.target.value)}
                                className="w-full h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 px-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                required
                            >
                                <option value="">-- Pilih Produk --</option>
                                {products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.nama_produk} ({product.satuan_default.toUpperCase()})
                                    </option>
                                ))}
                            </select>
                        </div>

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

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                            Simpan Harga
                        </Button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}
