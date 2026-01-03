"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
    const { login } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await api.post("/users", { name, email, password });
            // Register langsung auto-login
            login(res.data.token, res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Registrasi gagal.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

            <Card className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-emerald-600/10 p-4 rounded-2xl mb-4 text-emerald-500">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                        Buat Akun Baru
                    </h1>
                    <p className="text-neutral-500 text-sm mt-2">
                        Mulai catat pembukuan toko Anda
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <Input
                        label="Nama Lengkap"
                        type="text"
                        placeholder="Nama Toko / Pemilik"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="admin@toko.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" variant="primary" className="w-full bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20" isLoading={isLoading}>
                        Daftar
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-neutral-500">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
                        Masuk
                    </Link>
                </p>
            </Card>
        </div>
    );
}
