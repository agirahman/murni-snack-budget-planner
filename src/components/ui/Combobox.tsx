"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Option {
    id: string;
    label: string;
    metadata?: string;
}

interface ComboboxProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    label?: string;
    error?: string;
}

export const Combobox = ({
    options,
    value,
    onChange,
    placeholder = "Pilih item...",
    searchPlaceholder = "Cari...",
    emptyText = "Tidak ditemukan.",
    className,
    label,
    error
}: ComboboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.id === value);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionId: string) => {
        onChange(optionId);
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className={cn("w-full space-y-1.5", className)} ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex h-11 w-full items-center justify-between rounded-xl border bg-white dark:bg-neutral-900 px-3 py-2 text-sm transition-all duration-200 shadow-sm outline-none",
                        isOpen ? "ring-2 ring-blue-500/20 border-blue-500/50" : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700",
                        error && "border-red-500 focus:ring-red-500/20"
                    )}
                >
                    <span className={cn("truncate", !selectedOption && "text-neutral-400")}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={cn("h-4 w-4 text-neutral-400 transition-transform duration-200", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 z-50 mt-2 w-full animate-in fade-in zoom-in-95 duration-200">
                        <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
                            {/* Search Input */}
                            <div className="flex items-center border-b border-neutral-100 dark:border-neutral-800 p-2">
                                <Search className="ml-2 h-4 w-4 text-neutral-400 shrink-0" />
                                <input
                                    autoFocus
                                    className="flex h-9 w-full bg-transparent px-3 py-1 text-sm outline-none placeholder:text-neutral-500"
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                                    >
                                        <X className="h-3 w-3 text-neutral-400" />
                                    </button>
                                )}
                            </div>

                            {/* Options List */}
                            <div className="max-h-[250px] overflow-auto p-1 custom-scrollbar">
                                {filteredOptions.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-neutral-500">
                                        {emptyText}
                                    </div>
                                ) : (
                                    filteredOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => handleSelect(option.id)}
                                            className={cn(
                                                "relative flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors outline-none",
                                                "hover:bg-blue-50 dark:hover:bg-blue-500/10 text-neutral-700 dark:text-neutral-300",
                                                value === option.id && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                                            )}
                                        >
                                            <div className="flex flex-col items-start flex-1 truncate">
                                                <span>{option.label}</span>
                                                {option.metadata && (
                                                    <span className="text-[10px] text-neutral-400 font-normal uppercase mt-0.5">
                                                        {option.metadata}
                                                    </span>
                                                )}
                                            </div>
                                            {value === option.id && (
                                                <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
        </div>
    );
};
