"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
                <p>Memuat...</p>
            </div>
        );
    }

    // Role Check: Only 'admin' allowed
    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-4">
                <div className="bg-red-500/10 p-4 rounded-full text-red-500 mb-6">
                    <LogOut size={48} />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
                <p className="text-neutral-400 mb-8 max-w-md">
                    Maaf, halaman dashboard hanya dapat diakses oleh Administrator.
                    <br />
                    Akun Anda: <span className="text-white">{user?.role}</span>
                </p>
                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        Keluar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-100 flex flex-col">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-30 h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-blue-500 font-bold text-xl">
                        <LayoutDashboard />
                        <span>BudgetPlanner</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-sm text-right">
                            <p className="dark:text-white text-neutral-900 font-medium">{user?.name}</p>
                            <p className="dark:text-neutral-400 text-neutral-500 text-xs">{user?.email} ({user?.role})</p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                            <LogOut size={18} className="mr-2" />
                            Keluar
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-24 pb-12 container mx-auto px-4">
                {children}
            </main>
        </div>
    );
}
