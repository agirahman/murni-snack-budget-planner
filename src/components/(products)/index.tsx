"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Plus } from "lucide-react";
import { ProductSearch } from "./ProductSearch";
import { ProductList } from "./ProductList";
import { ProductModal } from "./ProductModal";

interface Product {
    _id: string;
    nama_produk: string;
    satuan_default: "kg" | "dus";
    created_at: string;
}

export default function ProductsComponent() {
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (isSubmitting) return;

        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
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

                <ProductSearch value={searchTerm} onChange={setSearchTerm} />

                <ProductList
                    products={filteredProducts}
                    loading={loading}
                    searchTerm={searchTerm}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    
                />

                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    editingProduct={editingProduct}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
