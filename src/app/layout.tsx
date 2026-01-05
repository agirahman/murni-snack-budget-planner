import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const quicksand = Quicksand({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Murni Snack Budget Planner",
  description: "Kelola keuangan toko Anda dengan mudah",
};

import { ThemeProvider } from "@/providers/theme-provider";
// import { ModeToggle } from "@/components/ui/ModeToggle";

// ... (imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${quicksand.className} min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <div className="fixed top-4 right-4 z-50">
            <ModeToggle />
          </div> */}
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
