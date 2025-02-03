import Layout from "@/components/layout/Layout";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pizza Express",
  description: "De beste pizzaene i byen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className={`scroll-smooth ${inter.className}`}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <div id="modal-root" className="relative z-[9999]"></div>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <OrderProvider>
                <Layout>{children}</Layout>
              </OrderProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
