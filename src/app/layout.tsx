import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prowider System",
  description: "Lead Distribution Backend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        {/* Modern Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">Prowider</span>
              </Link>
              <div className="flex gap-6">
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
                <Link href="/request-service" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">New Lead</Link>
                <Link href="/test-tools" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Testing Tools</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}