import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Planner",
  description: "Kelola keuangan toko Anda dengan mudah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100 antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
