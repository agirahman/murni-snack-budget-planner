"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-6 shadow-xl",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
