"use client";

import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Combobox } from "@/components/ui/Combobox";

interface PriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    setFormData: (data: any) => void;
    handleProductChange: (id: string) => void;
    products: any[];
    isSubmitting: boolean;
}

export function PriceModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    handleProductChange,
    products,
    isSubmitting
}: PriceModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Catat Harga Baru"
        >
            <form onSubmit={onSubmit} className="space-y-4">
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

                <Input
                    label="Harga"
                    type="number"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    placeholder="Contoh: 15000"
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Satuan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {(["kg", "dus"] as const).map(satuan => (
                            <button
                                key={satuan}
                                type="button"
                                onClick={() => setFormData({ ...formData, satuan })}
                                className={`p-3 rounded-lg text-sm font-medium transition-colors ${formData.satuan === satuan
                                    ? "bg-blue-600 text-white"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
                            >
                                {satuan.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

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
    );
}
