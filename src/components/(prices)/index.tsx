"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Plus } from "lucide-react";
import { TrendSection } from "./TrendSection";
import { PriceFilter } from "./PriceFilter";
import { PriceList } from "./PriceList";
import { PriceModal } from "./PriceModal";

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

export default function PricesComponent() {
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

                {selectedProductId && filteredPrices.length > 1 && (
                    <TrendSection data={filteredPrices} />
                )}

                <PriceFilter
                    products={products}
                    prices={prices}
                    selectedProductId={selectedProductId}
                    setSelectedProductId={setSelectedProductId}
                />

                <PriceList
                    prices={filteredPrices}
                    loading={loading}
                    formatRupiah={formatRupiah}
                />

                <PriceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    handleProductChange={handleProductChange}
                    products={products}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
