"use client";

import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import CartModal from "@/components/modals/CartModal";
import WelcomeModal from "@/components/modals/WelcomeModal";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const { isCartOpen, setIsCartOpen, items } = useCart();

  useEffect(() => {
    // Vis velkomstmodalen når siden lastes
    setIsWelcomeModalOpen(true);
  }, []);

  useEffect(() => {
    setIsCartModalOpen(isCartOpen);
  }, [isCartOpen]);

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
    </div>
  );
}
