"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full">
                {label && <label className="text-sm font-medium text-neutral-300 ml-1">{label}</label>}
                <input
                    type={type}
                    className={cn(
                        "flex h-11 w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
