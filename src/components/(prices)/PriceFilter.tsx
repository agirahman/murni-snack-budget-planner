"use client";

import { Combobox } from "@/components/ui/Combobox";

interface PriceFilterProps {
    products: any[];
    prices: any[];
    selectedProductId: string;
    setSelectedProductId: (id: string) => void;
}

export function PriceFilter({ products, prices, selectedProductId, setSelectedProductId }: PriceFilterProps) {
    return (
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
    );
}
