"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    isLoading?: boolean;
    children?: ReactNode;
}

export const Button = ({
    className,
    variant = "primary",
    isLoading,
    children,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_25px_-10px_rgba(37,99,235,0.5)]",
        secondary: "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-sm",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-[0_10px_20px_-10px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_25px_-10px_rgba(220,38,38,0.5)]",
        ghost: "bg-transparent hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95 hover:scale-[1.02]",
                variants[variant],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
        </button>
    );
};
