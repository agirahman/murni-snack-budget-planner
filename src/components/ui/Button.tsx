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
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20",
        secondary: "bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20",
        ghost: "bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white",
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
