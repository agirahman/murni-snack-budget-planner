"use client";

import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    setFormData: (data: any) => void;
    isSubmitting: boolean;
}

export function TransactionModal({ isOpen, onClose, onSubmit, formData, setFormData, isSubmitting }: TransactionModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Transaksi Baru"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Jenis Transaksi</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['pemasukan', 'pengeluaran'] as const).map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({ ...formData, type })}
                                className={`p-2 rounded-lg text-sm transition-colors ${formData.type === type
                                    ? (type === 'pemasukan' ? "bg-emerald-600 text-white shadow-sm" : "bg-red-600 text-white shadow-sm")
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
                            >
                                {type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                            </button>
                        ))}
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
    );
}
