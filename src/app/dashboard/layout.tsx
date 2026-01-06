"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, Package, TrendingUp, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, loading } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/products", label: "Produk", icon: Package },
        { href: "/dashboard/prices", label: "Harga", icon: TrendingUp },
    ];

    const isActive = (href: string) => pathname === href;

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Role Check: Only 'admin' allowed
    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center text-center p-4">
                <div className="bg-red-500/10 p-4 rounded-full text-red-500 mb-6">
                    <LogOut size={48} />
                </div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Akses Ditolak</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md">
                    Maaf, halaman dashboard hanya dapat diakses oleh Administrator.
                    <br />
                    Akun Anda: <span className="text-neutral-900 dark:text-white">{user?.role}</span>
                </p>
                <Button
                    variant="danger"
                    onClick={logout}
                >
                    Keluar
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-30 h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 text-blue-500 font-bold text-xl">
                        <LayoutDashboard />
                        <span className="hidden sm:inline">BudgetPlanner</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${isActive(link.href)
                                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                    : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    }`}
                            >
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* User Info - Desktop */}
                        <div className="hidden md:block text-sm text-right">
                            <p className="text-neutral-900 dark:text-white font-medium">{user?.name}</p>
                            <p className="text-neutral-500 dark:text-neutral-400 text-xs">{user?.email}</p>
                        </div>

                        {/* Logout - Desktop */}
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="hidden md:flex text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                            <LogOut size={18} className="mr-2" />
                            Keluar
                        </Button>

                        {/* Theme Toggle */}
                        <ModeToggle />

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-20 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute top-16 left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-xl">
                        <nav className="container mx-auto px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive(link.href)
                                        ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    <link.icon size={20} />
                                    {link.label}
                                </Link>
                            ))}

                            {/* Divider */}
                            <div className="border-t border-neutral-200 dark:border-neutral-800 my-3" />

                            {/* User Info - Mobile */}
                            <div className="px-4 py-2">
                                <p className="text-neutral-900 dark:text-white font-medium">{user?.name}</p>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm">{user?.email}</p>
                            </div>

                            {/* Logout - Mobile */}
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={20} />
                                Keluar
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 pt-24 pb-12 container mx-auto px-4">
                <ToastProvider>
                    {children}
                </ToastProvider>
            </main>
        </div>
    );
}
