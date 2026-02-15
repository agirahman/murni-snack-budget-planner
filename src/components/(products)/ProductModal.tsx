"use client";

import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    setFormData: (data: any) => void;
    editingProduct: any;
    isSubmitting: boolean;
}

export function ProductModal({ isOpen, onClose, onSubmit, formData, setFormData, editingProduct, isSubmitting }: ProductModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingProduct ? "Edit Produk" : "Tambah Produk"}
        >
            <form onSubmit={onSubmit} className="space-y-4">
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
                        {(["kg", "dus"] as const).map(satuan => (
                            <button
                                key={satuan}
                                type="button"
                                onClick={() => setFormData({ ...formData, satuan_default: satuan })}
                                className={`p-3 rounded-lg text-sm font-medium transition-colors ${formData.satuan_default === satuan
                                    ? "bg-blue-600 text-white"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
                            >
                                {satuan.toUpperCase()} {satuan === 'kg' ? '(Kilogram)' : '(Karton)'}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-2"
                    isLoading={isSubmitting}
                >
                    {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
                </Button>
            </form>
        </Modal>
    );
}
