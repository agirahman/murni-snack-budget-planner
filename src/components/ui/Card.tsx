"use client";

import { HTMLAttributes } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> { }

export const Card = ({ className, ...props }: CardProps) => {
    return (
        <div
            className={cn(
                "rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 dark:backdrop-blur-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500",
                className
            )}
            {...props}
        />
    );
};
