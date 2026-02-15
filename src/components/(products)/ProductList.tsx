"use client";

import { Card } from "@/components/ui/Card";
import { Package, Pencil, Trash2 } from "lucide-react";

interface Product {
    _id: string;
    nama_produk: string;
    satuan_default: "kg" | "dus";
    created_at: string;
}

interface ProductListProps {
    products: Product[];
    loading: boolean;
    searchTerm: string;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export function ProductList({ products, loading, searchTerm, onEdit, onDelete }: ProductListProps) {
    return (
        <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-sm relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            {loading ? (
                <div className="p-8 text-center text-neutral-500">Memuat data...</div>
            ) : products.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                    {searchTerm ? "Produk tidak ditemukan" : "Belum ada produk. Tambahkan produk pertama!"}
                </div>
            ) : (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {products.map((product) => (
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
                                    onClick={() => onEdit(product)}
                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg text-neutral-500 hover:text-blue-600 transition-colors"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(product._id)}
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
    );
}
