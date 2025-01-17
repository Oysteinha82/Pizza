import Layout from "@/components/layout/Layout";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Oswald } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

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
    <html
      lang="no"
      className={`scroll-smooth ${inter.className} ${playfair.variable} ${oswald.variable}`}
    >
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <div id="modal-root" className="relative z-[9999]"></div>
        <LanguageProvider>
          <Layout>{children}</Layout>
        </LanguageProvider>
      </body>
    </html>
  );
}
