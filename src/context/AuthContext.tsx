"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await api.get("/users/me");
            setUser(res.data.data);
        } catch (error) {
            console.error("Auth check failed", error);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (token: string, userData: User) => {
        localStorage.setItem("token", token);
        setUser(userData);
        router.push("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
