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
    hint?: string;
    error?: string | boolean;
    leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, hint, error, leftIcon, ...props }, ref) => {
        const hasError = Boolean(error);
        return (
            <div className="w-full">
                {label && <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">{label}</label>}
                <div className={cn("mt-1.5 relative flex items-center group/input", leftIcon && "gap-2")}>
                    {leftIcon && <div className="absolute left-3.5 pointer-events-none text-neutral-400 group-focus-within/input:text-blue-500 transition-colors">{leftIcon}</div>}
                    <input
                        type={type}
                        className={cn(
                            "flex h-12 w-full rounded-2xl border bg-white dark:bg-neutral-900/50 px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none transition-all duration-300 shadow-sm",
                            leftIcon && "pl-11",
                            hasError
                                ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                : "border-neutral-200 dark:border-neutral-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 hover:border-neutral-300 dark:hover:border-neutral-700",
                            className
                        )}
                        aria-invalid={hasError}
                        aria-describedby={hint || hasError ? `${props.id ?? props.name}-help` : undefined}
                        ref={ref}
                        {...props}
                    />
                </div>
                <div className="mt-1 min-h-4">
                    {hasError ? (
                        <p id={`${props.id ?? props.name}-help`} className="text-xs text-red-600">
                            {typeof error === "string" ? error : "Field tidak valid"}
                        </p>
                    ) : hint ? (
                        <p id={`${props.id ?? props.name}-help`} className="text-xs text-neutral-500 dark:text-neutral-400">
                            {hint}
                        </p>
                    ) : null}
                </div>
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
