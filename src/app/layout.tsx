import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const quicksand = Quicksand({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Murni Snack Budget Planner",
  description: "Kelola keuangan toko Anda dengan mudah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${quicksand.className} min-h-screen bg-neutral-950 text-neutral-100 antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
