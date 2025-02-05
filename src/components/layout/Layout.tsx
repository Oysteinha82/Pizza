"use client";

import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import CartModal from "@/components/modals/CartModal";
import WelcomeModal from "@/components/modals/WelcomeModal";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { isCartOpen, setIsCartOpen, items } = useCart();

  useEffect(() => {
    // Vis velkomstmodalen når siden lastes
    setIsWelcomeModalOpen(true);
  }, []);

  useEffect(() => {
    setIsCartModalOpen(isCartOpen);
  }, [isCartOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Vis knappen når vi har scrollet mer enn 500px
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onLoginClick={() => setIsLoginModalOpen(true)}
        onCartClick={() => setIsCartModalOpen(true)}
      />
      <main className="flex-grow">{children}</main>
      <Footer onLegalClick={() => setIsWelcomeModalOpen(true)} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
      />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed z-40 
                     bg-red-600/90 hover:bg-red-700 text-white
                     transition-all duration-300 group backdrop-blur-sm
                     shadow-lg hover:shadow-xl
                     
                     /* Mobil og medium (bottom-center) */
                     bottom-4 inset-x-0 mx-auto w-fit
                     rounded-full p-2
                     
                     /* Desktop (right side) - 1380px er maks-bredde + 100px */
                     min-[1380px]:left-auto min-[1380px]:right-8 min-[1380px]:translate-x-0
                     min-[1380px]:bottom-8 min-[1380px]:rounded-xl
                     min-[1380px]:p-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <svg
                className="w-4 h-4 min-[1380px]:w-5 min-[1380px]:h-5 transform transition-transform duration-300 group-hover:-translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <div className="absolute inset-0 bg-white/20 rounded-lg filter blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
