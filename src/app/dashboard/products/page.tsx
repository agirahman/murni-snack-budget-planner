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
import { Plus, Pencil, Trash2, Package } from "lucide-react";

interface Product {
    _id: string;
    nama_produk: string;
    satuan_default: "kg" | "dus";
    created_at: string;
}

export default function ProductsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        nama_produk: "",
        satuan_default: "kg" as "kg" | "dus"
    });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/products");
            setProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData);
                showToast("Produk berhasil diperbarui", "success");
            } else {
                await api.post("/products", formData);
                showToast("Produk berhasil ditambahkan", "success");
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ nama_produk: "", satuan_default: "kg" });
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            showToast("Gagal menyimpan produk", "error");
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            nama_produk: product.nama_produk,
            satuan_default: product.satuan_default
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Yakin ingin menghapus produk ini?")) {
            try {
                await api.delete(`/products/${id}`);
                showToast("Produk berhasil dihapus", "success");
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                showToast("Gagal menghapus produk", "error");
            }
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({ nama_produk: "", satuan_default: "kg" });
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Master Produk</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">Kelola daftar produk untuk pencatatan harga</p>
                    </div>
                    <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Produk
                    </Button>
                </div>

                {/* Search */}
                <Input
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Products List */}
                <Card className="overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-neutral-500">Memuat data...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500">
                            {searchTerm ? "Produk tidak ditemukan" : "Belum ada produk. Tambahkan produk pertama!"}
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-neutral-900 dark:text-white">{product.nama_produk}</h3>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                Satuan: {product.satuan_default.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg text-neutral-500 hover:text-blue-600 transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg text-neutral-500 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingProduct ? "Edit Produk" : "Tambah Produk"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nama Produk"
                            value={formData.nama_produk}
                            onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                            placeholder="Contoh: Tepung Terigu"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Satuan Default
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, satuan_default: "kg" })}
                                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${formData.satuan_default === "kg"
                                        ? "bg-blue-600 text-white"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
                                >
                                    KG (Kilogram)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, satuan_default: "dus" })}
                                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${formData.satuan_default === "dus"
                                        ? "bg-blue-600 text-white"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
                                >
                                    DUS (Karton)
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                            {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
                        </Button>
                    </form>
                </Modal>
            </div>
        </div>
    );
}
