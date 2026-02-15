"use client";

import { Input } from "@/components/ui/Input";

interface ProductSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
    return (
        <div className="sticky top-16 z-20 -mx-4 px-4 py-4 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-transparent transition-all duration-200">
            <div className="max-w-4xl mx-auto">
                <div className="relative group/search">
                    <Input
                        placeholder="Cari produk berdasarkan nama..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="pl-4 h-12 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
}
